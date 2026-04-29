const { clampNumber, randomId, safeString } = require("./util");

function roomSnapshot(room, users, onlineUserIds) {
  const host = users.getUserById(room.hostId);
  return {
    id: room.id,
    name: room.name,
    visibility: room.visibility,
    maxPlayers: room.maxPlayers,
    hostId: room.hostId,
    hostNickname: host ? host.nickname : "Unknown",
    locked: room.locked,
    playerCount: room.players.size,
    players: Array.from(room.players).map((id) => {
      const u = users.getUserById(id);
      return {
        id,
        nickname: u ? u.nickname : "Unknown",
        ready: room.ready.has(id),
        online: onlineUserIds.has(id),
      };
    }),
    joinCodeHint: room.visibility === "private" ? "code" : null,
    settings: room.settings || null,
  };
}

class RoomManager {
  constructor({ userStore }) {
    this.userStore = userStore;
    this.rooms = new Map(); // roomId -> room
    this.userRoom = new Map(); // userId -> roomId
  }

  listRooms({ requesterId, onlineUserIds }) {
    const requester = this.userStore.getUserById(requesterId);
    const out = [];
    for (const room of this.rooms.values()) {
      if (room.visibility === "friends") {
        // friends-only: requester must be in host's friend list
        const host = this.userStore.getUserById(room.hostId);
        if (!host || !host.friends.has(requester?.id || "")) continue;
      }
      if (room.locked) continue;
      out.push(roomSnapshot(room, this.userStore, onlineUserIds));
    }
    return out;
  }

  getRoomIdByUser(userId) {
    return this.userRoom.get(userId) || "";
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  createRoom({ hostId, name, visibility, maxPlayers }) {
    const cleanName = safeString(name, 24, "Room");
    const mode = visibility === "private" || visibility === "friends" ? visibility : "public";
    const limit = clampNumber(maxPlayers, 2, 8, 4);

    const room = {
      id: randomId("r_"),
      name: cleanName,
      visibility: mode,
      maxPlayers: limit,
      hostId,
      code: mode === "private" ? randomId("").slice(0, 6).toUpperCase() : "",
      locked: false,
      settings: null,
      players: new Set([hostId]),
      ready: new Set(),
      createdAt: Date.now(),
    };
    this.rooms.set(room.id, room);
    this.userRoom.set(hostId, room.id);
    return room;
  }

  canJoinRoom({ requesterId, room, code }) {
    if (!room || room.locked) return { ok: false, error: "room_locked" };
    if (room.players.size >= room.maxPlayers) return { ok: false, error: "room_full" };
    if (room.visibility === "private") {
      if (!code || String(code).toUpperCase() !== room.code) return { ok: false, error: "bad_code" };
    } else if (room.visibility === "friends") {
      const host = this.userStore.getUserById(room.hostId);
      if (!host || !host.friends.has(requesterId)) return { ok: false, error: "not_friend" };
    }
    return { ok: true };
  }

  joinRoom({ userId, roomId, code }) {
    const current = this.userRoom.get(userId);
    if (current) {
      if (current === roomId) return { ok: true, room: this.rooms.get(roomId) };
      this.leaveRoom({ userId });
    }

    const room = this.rooms.get(roomId);
    const allowed = this.canJoinRoom({ requesterId: userId, room, code });
    if (!allowed.ok) return allowed;

    room.players.add(userId);
    this.userRoom.set(userId, roomId);
    return { ok: true, room };
  }

  leaveRoom({ userId }) {
    const roomId = this.userRoom.get(userId);
    if (!roomId) return { ok: true };
    const room = this.rooms.get(roomId);
    this.userRoom.delete(userId);
    if (!room) return { ok: true };

    room.players.delete(userId);
    room.ready.delete(userId);

    if (room.players.size === 0) {
      this.rooms.delete(roomId);
      return { ok: true, removedRoomId: roomId };
    }

    if (room.hostId === userId) {
      room.hostId = Array.from(room.players)[0];
    }

    return { ok: true, room };
  }

  setReady({ userId, ready }) {
    const roomId = this.userRoom.get(userId);
    if (!roomId) return { ok: false, error: "not_in_room" };
    const room = this.rooms.get(roomId);
    if (!room) return { ok: false, error: "not_in_room" };
    if (ready) room.ready.add(userId);
    else room.ready.delete(userId);
    return { ok: true, room };
  }

  startGame({ userId, settings }) {
    const roomId = this.userRoom.get(userId);
    if (!roomId) return { ok: false, error: "not_in_room" };
    const room = this.rooms.get(roomId);
    if (!room) return { ok: false, error: "not_in_room" };
    if (room.hostId !== userId) return { ok: false, error: "not_host" };
    if (room.locked) return { ok: false, error: "already_started" };
    for (const pid of room.players) {
      if (!room.ready.has(pid)) return { ok: false, error: "not_all_ready" };
    }
    room.settings = settings || null;
    room.locked = true;
    return { ok: true, room };
  }
}

module.exports = {
  RoomManager,
  roomSnapshot,
};
