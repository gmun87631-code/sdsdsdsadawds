const { safeString } = require("./util");

class FriendManager {
  constructor({ userStore, network }) {
    this.userStore = userStore;
    this.network = network;
  }

  getPublicFriendState(userId) {
    const user = this.userStore.getUserById(userId);
    if (!user) return { friends: [], incoming: [], outgoing: [] };
    return {
      friends: Array.from(user.friends),
      incoming: Array.from(user.incoming),
      outgoing: Array.from(user.outgoing),
    };
  }

  sendFriendRequest(fromId, toNicknameRaw) {
    const toNickname = safeString(toNicknameRaw, 20, "");
    if (!toNickname) return { ok: false, error: "bad_nickname" };
    const from = this.userStore.getUserById(fromId);
    const to = this.userStore.getUserByNickname(toNickname);
    if (!from || !to) return { ok: false, error: "not_found" };
    if (from.id === to.id) return { ok: false, error: "self" };
    if (from.friends.has(to.id)) return { ok: false, error: "already_friends" };
    if (from.outgoing.has(to.id)) return { ok: false, error: "already_sent" };
    if (from.incoming.has(to.id)) return { ok: false, error: "already_received" };

    from.outgoing.add(to.id);
    to.incoming.add(from.id);
    this.userStore.persist();

    return { ok: true, toId: to.id, toNickname: to.nickname };
  }

  acceptFriendRequest(userId, fromIdRaw) {
    const fromId = safeString(fromIdRaw, 64, "");
    const user = this.userStore.getUserById(userId);
    const from = this.userStore.getUserById(fromId);
    if (!user || !from) return { ok: false, error: "not_found" };
    if (!user.incoming.has(from.id)) return { ok: false, error: "no_request" };

    user.incoming.delete(from.id);
    from.outgoing.delete(user.id);
    user.friends.add(from.id);
    from.friends.add(user.id);
    this.userStore.persist();
    return { ok: true, friendId: from.id, friendNickname: from.nickname };
  }

  rejectFriendRequest(userId, fromIdRaw) {
    const fromId = safeString(fromIdRaw, 64, "");
    const user = this.userStore.getUserById(userId);
    const from = this.userStore.getUserById(fromId);
    if (!user || !from) return { ok: false, error: "not_found" };
    if (!user.incoming.has(from.id)) return { ok: false, error: "no_request" };

    user.incoming.delete(from.id);
    from.outgoing.delete(user.id);
    this.userStore.persist();
    return { ok: true };
  }
}

module.exports = {
  FriendManager,
};

