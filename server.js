const fs = require("fs");
const http = require("http");
const path = require("path");

const { NetworkManager } = require("./online/NetworkManager");
const { FriendManager } = require("./online/FriendManager");
const { RoomManager, roomSnapshot } = require("./online/RoomManager");
const { LobbyManager, PlayerStore } = require("./online/LobbyManager");
const { safeString } = require("./online/util");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.normalize(path.join(ROOT, decodeURIComponent(requestedPath)));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
});

const userStore = new PlayerStore();
const roomManager = new RoomManager({ userStore });
const friendManager = new FriendManager({ userStore });
let lobbyManager;
let network;

function sendError(client, requestId, error) {
  network.send(client, { type: "online.error", requestId, error });
}

function broadcastRoom(room, message) {
  if (!room) return;
  const clients = [];
  for (const userId of room.players) {
    const c = lobbyManager.onlineByUserId.get(userId);
    if (c) clients.push(c);
  }
  network.broadcastToClients(clients, message);
}

function broadcastRoomsUpdate() {
  const onlineIds = lobbyManager.getOnlineUserIds();
  for (const client of lobbyManager.onlineByUserId.values()) {
    network.send(client, {
      type: "online.rooms.update",
      rooms: roomManager.listRooms({ requesterId: client.userId, onlineUserIds: onlineIds }),
    });
  }
}

function broadcastRoomUpdate(room) {
  const onlineIds = lobbyManager.getOnlineUserIds();
  broadcastRoom(room, {
    type: "online.room.update",
    room: roomSnapshot(room, userStore, onlineIds),
  });
}

function sendSelfSnapshot(client) {
  network.send(client, {
    type: "online.self",
    self: lobbyManager.onlineSnapshot(client.userId),
  });
}

function readLoginCredentials(message) {
  const source =
    message?.credentials && typeof message.credentials === "object" ? message.credentials
      : message?.player && typeof message.player === "object" ? message.player
        : message?.data && typeof message.data === "object" ? message.data
          : message;

  return {
    nickname: source?.nickname ?? source?.username ?? source?.name ?? message?.nickname,
    password: source?.password ?? message?.password,
  };
}

network = new NetworkManager({
  server,
  onClientMessage: (client, message) => {
    const type = typeof message?.type === "string" ? message.type : "";
    const requestId = safeString(message?.requestId, 36, "");

    if (type === "online.hello" || type === "login") {
      const credentials = readLoginCredentials(message);
      const auth = lobbyManager.authOrRegister({
        nicknameRaw: credentials.nickname,
        passwordRaw: credentials.password,
      });
      if (!auth.ok) {
        sendError(client, requestId, auth.error);
        return;
      }
      lobbyManager.attachClient(client, auth.user);
      const self = lobbyManager.onlineSnapshot(client.userId);
      // Always emit the canonical hello response so existing clients don't need to care about aliases.
      network.send(client, { type: "online.hello.ok", requestId, self });
      // Also emit legacy/alternate ack for clients that still send `type: "login"`.
      if (type === "login") {
        network.send(client, { type: "login.ok", requestId, self });
      }
      broadcastRoomsUpdate();
      return;
    }

    if (!client.userId) {
      sendError(client, requestId, "unauthenticated");
      return;
    }

    if (type === "online.rooms.list") {
      const onlineIds = lobbyManager.getOnlineUserIds();
      network.send(client, {
        type: "online.rooms.list.ok",
        requestId,
        rooms: roomManager.listRooms({ requesterId: client.userId, onlineUserIds: onlineIds }),
      });
      return;
    }

    if (type === "online.room.create") {
      const room = roomManager.createRoom({
        hostId: client.userId,
        name: message.name,
        visibility: message.visibility,
        maxPlayers: message.maxPlayers,
      });
      network.send(client, {
        type: "online.room.joined",
        requestId,
        roomId: room.id,
        code: room.code || null,
      });
      broadcastRoomsUpdate();
      broadcastRoomUpdate(room);
      return;
    }

    if (type === "online.room.join") {
      const roomId = safeString(message.roomId, 64, "");
      if (!roomId) {
        sendError(client, requestId, "bad_room");
        return;
      }
      const result = roomManager.joinRoom({ userId: client.userId, roomId, code: message.code });
      if (!result.ok) {
        sendError(client, requestId, result.error);
        return;
      }
      network.send(client, { type: "online.room.joined", requestId, roomId, code: null });
      broadcastRoomsUpdate();
      broadcastRoomUpdate(result.room);
      return;
    }

    if (type === "online.room.leave") {
      const prevRoomId = roomManager.getRoomIdByUser(client.userId);
      const result = roomManager.leaveRoom({ userId: client.userId });
      network.send(client, { type: "online.room.left", requestId });
      if (result.room) broadcastRoomUpdate(result.room);
      if (result.removedRoomId) {
        // nothing
      }
      if (prevRoomId) broadcastRoomsUpdate();
      return;
    }

    if (type === "online.room.ready") {
      const ready = Boolean(message.ready);
      const result = roomManager.setReady({ userId: client.userId, ready });
      if (!result.ok) {
        sendError(client, requestId, result.error);
        return;
      }
      broadcastRoomUpdate(result.room);
      return;
    }

    if (type === "online.room.start") {
      const result = roomManager.startGame({
        userId: client.userId,
        settings: message.settings && typeof message.settings === "object" ? message.settings : null,
      });
      if (!result.ok) {
        sendError(client, requestId, result.error);
        return;
      }
      broadcastRoom(result.room, { type: "online.game.started", roomId: result.room.id, settings: result.room.settings || null });
      broadcastRoomsUpdate();
      broadcastRoomUpdate(result.room);
      return;
    }

    if (type === "online.friend.request") {
      const result = friendManager.sendFriendRequest(client.userId, message.nickname);
      if (!result.ok) {
        sendError(client, requestId, result.error);
        return;
      }
      sendSelfSnapshot(client);
      const toClient = lobbyManager.onlineByUserId.get(result.toId);
      if (toClient) sendSelfSnapshot(toClient);
      return;
    }

    if (type === "online.friend.accept") {
      const result = friendManager.acceptFriendRequest(client.userId, message.userId);
      if (!result.ok) {
        sendError(client, requestId, result.error);
        return;
      }
      sendSelfSnapshot(client);
      const other = lobbyManager.onlineByUserId.get(result.friendId);
      if (other) sendSelfSnapshot(other);
      return;
    }

    if (type === "online.friend.reject") {
      const result = friendManager.rejectFriendRequest(client.userId, message.userId);
      if (!result.ok) {
        sendError(client, requestId, result.error);
        return;
      }
      sendSelfSnapshot(client);
      return;
    }

    if (type === "online.friend.invite") {
      const toId = safeString(message.userId, 64, "");
      const toClient = lobbyManager.onlineByUserId.get(toId);
      if (!toClient) {
        sendError(client, requestId, "offline");
        return;
      }
      const roomId = roomManager.getRoomIdByUser(client.userId);
      if (!roomId) {
        sendError(client, requestId, "not_in_room");
        return;
      }
      const room = roomManager.getRoom(roomId);
      if (!room) {
        sendError(client, requestId, "not_in_room");
        return;
      }
      network.send(toClient, {
        type: "online.friend.invite",
        fromId: client.userId,
        fromNickname: client.nickname,
        roomId: room.id,
        roomName: room.name,
        roomVisibility: room.visibility,
        code: room.visibility === "private" ? room.code : null,
      });
      network.send(client, { type: "online.friend.invite.ok", requestId });
      return;
    }

    if (type === "online.game.state") {
      const roomId = roomManager.getRoomIdByUser(client.userId);
      const room = roomManager.getRoom(roomId);
      if (!room || !room.locked || !room.players.has(client.userId)) {
        return;
      }
      // Prototype: just broadcast validated sender + payload within room.
      broadcastRoom(room, {
        type: "online.game.state",
        userId: client.userId,
        nickname: client.nickname,
        player: message.player || null,
      });
      return;
    }
  },
  onClientClose: (client) => {
    if (client.userId) {
      const roomId = roomManager.getRoomIdByUser(client.userId);
      const result = roomManager.leaveRoom({ userId: client.userId });
      lobbyManager.handleDisconnect(client);
      if (result.room) broadcastRoomUpdate(result.room);
      if (roomId) broadcastRoomsUpdate();
    }
  },
});

lobbyManager = new LobbyManager({ userStore, roomManager, friendManager, network });

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Starling Sprint online server running at http://localhost:${PORT}`);
});
