const crypto = require("crypto");

function encodeFrame(text) {
  const payload = Buffer.from(text);
  const length = payload.length;
  if (length < 126) {
    return Buffer.concat([Buffer.from([0x81, length]), payload]);
  }
  if (length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
    return Buffer.concat([header, payload]);
  }
  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(length), 2);
  return Buffer.concat([header, payload]);
}

function decodeFrames(buffer) {
  const messages = [];
  let offset = 0;
  while (offset + 2 <= buffer.length) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    const opcode = first & 0x0f;
    const masked = (second & 0x80) !== 0;
    let length = second & 0x7f;
    let headerLength = 2;

    if (length === 126) {
      if (offset + 4 > buffer.length) break;
      length = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (length === 127) {
      if (offset + 10 > buffer.length) break;
      length = Number(buffer.readBigUInt64BE(offset + 2));
      headerLength = 10;
    }

    const maskLength = masked ? 4 : 0;
    const frameEnd = offset + headerLength + maskLength + length;
    if (frameEnd > buffer.length) break;

    if (opcode === 0x8) {
      messages.push({ close: true });
    } else if (opcode === 0x1) {
      const mask = masked ? buffer.subarray(offset + headerLength, offset + headerLength + 4) : null;
      const payloadStart = offset + headerLength + maskLength;
      const payload = Buffer.from(buffer.subarray(payloadStart, payloadStart + length));
      if (mask) {
        for (let i = 0; i < payload.length; i += 1) {
          payload[i] ^= mask[i % 4];
        }
      }
      messages.push({ text: payload.toString("utf8") });
    }

    offset = frameEnd;
  }
  return messages;
}

class NetworkManager {
  constructor({ server, onClientMessage, onClientClose }) {
    this.server = server;
    this.onClientMessage = onClientMessage;
    this.onClientClose = onClientClose;
    this.clients = new Map(); // socket -> client

    server.on("upgrade", (req, socket) => this.#handleUpgrade(req, socket));
  }

  #handleUpgrade(req, socket) {
    const key = req.headers["sec-websocket-key"];
    if (!key) {
      socket.destroy();
      return;
    }

    const accept = crypto
      .createHash("sha1")
      .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
      .digest("base64");

    socket.write([
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${accept}`,
      "",
      "",
    ].join("\r\n"));

    const client = {
      socket,
      sessionId: crypto.randomBytes(8).toString("hex"),
      userId: "",
      nickname: "",
    };
    this.clients.set(socket, client);

    socket.on("data", (chunk) => {
      for (const frame of decodeFrames(chunk)) {
        if (frame.close) {
          this.removeClient(client);
          socket.end();
          return;
        }
        let message;
        try {
          message = JSON.parse(frame.text);
        } catch (_) {
          continue;
        }
        this.onClientMessage?.(client, message);
      }
    });

    socket.on("close", () => this.removeClient(client));
    socket.on("error", () => this.removeClient(client));
  }

  send(client, message) {
    if (!client?.socket || client.socket.destroyed) return;
    client.socket.write(encodeFrame(JSON.stringify(message)));
  }

  broadcastToClients(clients, message) {
    for (const client of clients) {
      this.send(client, message);
    }
  }

  removeClient(client) {
    if (!client) return;
    if (!this.clients.has(client.socket)) return;
    this.clients.delete(client.socket);
    this.onClientClose?.(client);
  }

  getAllClients() {
    return Array.from(this.clients.values());
  }
}

module.exports = {
  NetworkManager,
};

