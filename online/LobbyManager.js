const { hashPassword, randomId, safeString } = require("./util");
const { loadPlayers, savePlayers } = require("./storage");

class PlayerStore {
  constructor() {
    const { players } = loadPlayers();
    this.usersById = new Map();
    this.usersByNickname = new Map();
    for (const [id, user] of Object.entries(players)) {
      this.#hydrateUser(id, user);
    }
  }

  #hydrateUser(id, raw) {
    const nickname = safeString(raw.nickname, 20, "");
    if (!nickname) return;
    const user = {
      id,
      nickname,
      pass: typeof raw.pass === "string" ? raw.pass : "",
      salt: typeof raw.salt === "string" ? raw.salt : "",
      friends: new Set(Array.isArray(raw.friends) ? raw.friends : []),
      incoming: new Set(Array.isArray(raw.incoming) ? raw.incoming : []),
      outgoing: new Set(Array.isArray(raw.outgoing) ? raw.outgoing : []),
    };
    this.usersById.set(id, user);
    this.usersByNickname.set(nickname.toLowerCase(), user);
  }

  persist() {
    const out = {};
    for (const user of this.usersById.values()) {
      out[user.id] = {
        nickname: user.nickname,
        pass: user.pass,
        salt: user.salt,
        friends: Array.from(user.friends),
        incoming: Array.from(user.incoming),
        outgoing: Array.from(user.outgoing),
      };
    }
    savePlayers(out);
  }

  getUserById(id) {
    return this.usersById.get(id) || null;
  }

  getUserByNickname(nickname) {
    if (!nickname) return null;
    return this.usersByNickname.get(String(nickname).toLowerCase()) || null;
  }

  createUser({ id, nickname, pass, salt }) {
    const user = {
      id,
      nickname,
      pass,
      salt,
      friends: new Set(),
      incoming: new Set(),
      outgoing: new Set(),
    };
    this.usersById.set(id, user);
    this.usersByNickname.set(nickname.toLowerCase(), user);
    this.persist();
    return user;
  }

  authenticateOrCreate({ nicknameRaw, passwordRaw }) {
    const nickname = safeString(nicknameRaw, 20, "");
    if (!nickname) return { ok: false, error: "bad_nickname" };

    const password = typeof passwordRaw === "string" ? passwordRaw.trim().slice(0, 64) : "";
    const existing = this.getUserByNickname(nickname);
    if (existing) {
      if (existing.pass) {
        if (!password) return { ok: false, error: "missing_password" };
        if (hashPassword(password, existing.salt) !== existing.pass) {
          return { ok: false, error: "bad_password" };
        }
      }
      return { ok: true, user: existing, created: false };
    }

    const salt = password ? randomId("") : "";
    const pass = password ? hashPassword(password, salt) : "";
    const id = `u_${Buffer.from(nickname).toString("hex").slice(0, 16)}`;
    const user = this.createUser({ id, nickname, pass, salt });
    return { ok: true, user, created: true };
  }
}

const UserStore = PlayerStore;

class LobbyManager {
  constructor({ userStore, roomManager, friendManager, network }) {
    this.userStore = userStore;
    this.roomManager = roomManager;
    this.friendManager = friendManager;
    this.network = network;
    this.onlineByUserId = new Map(); // userId -> client
  }

  getOnlineUserIds() {
    return new Set(this.onlineByUserId.keys());
  }

  handleDisconnect(client) {
    if (!client.userId) return;
    this.onlineByUserId.delete(client.userId);
  }

  authOrRegister({ nicknameRaw, passwordRaw }) {
    return this.userStore.authenticateOrCreate({ nicknameRaw, passwordRaw });
  }

  attachClient(client, user) {
    client.userId = user.id;
    client.nickname = user.nickname;
    this.onlineByUserId.set(user.id, client);
  }

  onlineSnapshot(userId) {
    const user = this.userStore.getUserById(userId);
    if (!user) return null;
    return {
      id: user.id,
      nickname: user.nickname,
      friends: Array.from(user.friends).map((fid) => {
        const f = this.userStore.getUserById(fid);
        return {
          id: fid,
          nickname: f ? f.nickname : "Unknown",
          online: this.onlineByUserId.has(fid),
        };
      }),
      incoming: Array.from(user.incoming).map((fid) => {
        const f = this.userStore.getUserById(fid);
        return { id: fid, nickname: f ? f.nickname : "Unknown" };
      }),
      outgoing: Array.from(user.outgoing).map((fid) => {
        const f = this.userStore.getUserById(fid);
        return { id: fid, nickname: f ? f.nickname : "Unknown" };
      }),
    };
  }
}

module.exports = {
  LobbyManager,
  PlayerStore,
  UserStore,
};
