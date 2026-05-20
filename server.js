const fs = require("fs");
const http = require("http");
const path = require("path");

const { NetworkManager } = require("./online/NetworkManager");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const CARD_TYPES = Object.freeze({
  SCISSORS: "Scissors",
  ROCK: "Rock",
  PAPER: "Paper",
  GUARD: "Guard",
  PIERCE: "Pierce",
  DODGE: "Dodge",
});

const BASIC_CARDS = [CARD_TYPES.SCISSORS, CARD_TYPES.ROCK, CARD_TYPES.PAPER];

const GAME_CONFIG = Object.freeze({
  maxPlayers: 10,
  startingLives: 2,
  matchDurationMs: 6 * 60 * 1000,
  choiceTimeMs: 8000,
  drawPhaseMs: 900,
  revealTimeMs: 2200,
  resultTimeMs: 3300,
  cardsDrawnPerRound: 3,
  hardcoreMode: false,
  cardWeights: {
    Scissors: 20,
    Rock: 20,
    Paper: 20,
    Guard: 18,
    Pierce: 14,
    Dodge: 8,
  },
  suddenDeath: {
    guardWeight: 8,
    noEliminationRoundsBeforeDanger: 3,
    dangerCardsEnabled: true,
  },
});

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

function now() {
  return Date.now();
}

function id(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeName(value, fallback) {
  const cleaned = String(value || "").trim().replace(/[^\w .-]/g, "").slice(0, 18);
  return cleaned || fallback;
}

function clampInteger(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

class PlayerState {
  constructor({ id: playerId, name, client = null, bot = false, host = false, lives }) {
    this.id = playerId;
    this.name = name;
    this.client = client;
    this.bot = bot;
    this.host = host;
    this.lives = lives;
    this.alive = true;
    this.spectator = false;
    this.hand = [];
    this.selection = null;
    this.locked = false;
    this.lastPlayedCard = null;
    this.eliminatedRound = null;
  }
}

class DeckSystem {
  constructor(config) {
    this.config = config;
  }

  weightsFor({ suddenDeath }) {
    const weights = { ...this.config.cardWeights };
    if (suddenDeath) {
      delete weights[CARD_TYPES.DODGE];
      weights[CARD_TYPES.GUARD] = this.config.suddenDeath.guardWeight;
    }
    return weights;
  }

  drawCard(options) {
    const weights = this.weightsFor(options);
    const entries = Object.entries(weights).filter(([, weight]) => weight > 0);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [card, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return card;
    }
    return entries[entries.length - 1][0];
  }
}

class CardDrawSystem {
  constructor({ deckSystem, config }) {
    this.deckSystem = deckSystem;
    this.config = config;
  }

  drawHand(matchState) {
    return Array.from({ length: this.config.cardsDrawnPerRound }, () =>
      this.deckSystem.drawCard({ suddenDeath: matchState.suddenDeath }));
  }
}

class CardSelectionSystem {
  validate({ player, card, phase }) {
    if (!player) return { ok: false, error: "Player not found." };
    if (phase !== "select") return { ok: false, error: "Cards can only be chosen during selection." };
    if (!player.alive) return { ok: false, error: "Spectators cannot choose cards." };
    if (player.locked) return { ok: false, error: "Card already locked in." };
    if (!player.hand.includes(card)) return { ok: false, error: "That card is not in your hand." };
    if (card === CARD_TYPES.DODGE && player.lastPlayedCard === CARD_TYPES.DODGE) {
      return { ok: false, error: "Dodge cannot be used two rounds in a row." };
    }
    return { ok: true };
  }

  lock(player, card, automatic = false) {
    player.selection = card;
    player.locked = true;
    player.automaticSelection = automatic;
  }

  chooseRandom(player) {
    const playable = player.hand.filter((card) => !(card === CARD_TYPES.DODGE && player.lastPlayedCard === CARD_TYPES.DODGE));
    const options = playable.length ? playable : player.hand.filter((card) => card !== CARD_TYPES.DODGE);
    const fallback = options.length ? options : player.hand;
    const card = fallback[Math.floor(Math.random() * fallback.length)];
    this.lock(player, card, true);
  }
}

class ResultResolver {
  resolve({ players, suddenDeath, dangerCard, hardcoreMode }) {
    const alivePlayers = players.filter((player) => player.alive);
    const selected = new Map(alivePlayers.map((player) => [player.id, player.selection]));
    const losses = new Map();
    const survives = new Set();
    const notes = [];

    const markLoss = (player, reason) => {
      if (!losses.has(player.id)) losses.set(player.id, []);
      losses.get(player.id).push(reason);
    };

    for (const player of alivePlayers) {
      if (selected.get(player.id) === CARD_TYPES.DODGE) {
        survives.add(player.id);
        notes.push(`${player.name} dodged out of danger.`);
      }
    }

    const dangerPool = alivePlayers.filter((player) => selected.get(player.id) !== CARD_TYPES.DODGE);
    const piercePlayers = dangerPool.filter((player) => selected.get(player.id) === CARD_TYPES.PIERCE);
    const guardPlayers = dangerPool.filter((player) => selected.get(player.id) === CARD_TYPES.GUARD);

    if (piercePlayers.length && guardPlayers.length) {
      for (const player of guardPlayers) markLoss(player, "Guard was pierced.");
      for (const player of piercePlayers) survives.add(player.id);
      notes.push("Pierce broke every Guard.");
    } else if (piercePlayers.length) {
      for (const player of piercePlayers) survives.add(player.id);
      notes.push("Pierce found no Guard and became defensive only.");
    }

    for (const player of guardPlayers) {
      if (!losses.has(player.id)) {
        survives.add(player.id);
        notes.push(`${player.name} guarded safely.`);
      }
    }

    const basicPlayers = dangerPool.filter((player) => BASIC_CARDS.includes(selected.get(player.id)));
    const basicTypes = new Set(basicPlayers.map((player) => selected.get(player.id)));

    if (basicTypes.size === 2) {
      const [first, second] = Array.from(basicTypes);
      const winner = this.winningBasicCard(first, second);
      const loser = first === winner ? second : first;
      for (const player of basicPlayers) {
        if (selected.get(player.id) === loser) markLoss(player, `${loser} lost to ${winner}.`);
        if (selected.get(player.id) === winner) survives.add(player.id);
      }
      notes.push(`${winner} beat ${loser}.`);
    } else if (basicTypes.size === 1) {
      for (const player of basicPlayers) survives.add(player.id);
      notes.push("Only one basic card type appeared, so it was a draw.");
    } else if (basicTypes.size === 3) {
      for (const player of basicPlayers) survives.add(player.id);
      notes.push("Rock, Paper, and Scissors all appeared, so it was a full draw.");
    }

    if (suddenDeath && dangerCard) {
      const dangerVictims = alivePlayers.filter((player) => selected.get(player.id) === dangerCard);
      for (const player of dangerVictims) markLoss(player, `${dangerCard} was the danger card.`);
      if (dangerVictims.length) notes.push(`${dangerCard} was dangerous this round.`);
    }

    const lifeChanges = [];
    for (const player of alivePlayers) {
      const reasons = losses.get(player.id) || [];
      if (!reasons.length) continue;
      const before = player.lives;
      player.lives = suddenDeath || hardcoreMode ? 0 : Math.max(0, player.lives - 1);
      lifeChanges.push({
        id: player.id,
        name: player.name,
        card: player.selection,
        before,
        after: player.lives,
        reasons,
      });
    }

    return {
      notes,
      losses: lifeChanges,
      survivors: alivePlayers
        .filter((player) => !losses.has(player.id))
        .map((player) => ({ id: player.id, name: player.name, card: player.selection })),
      hadElimination: false,
    };
  }

  winningBasicCard(a, b) {
    if ((a === CARD_TYPES.SCISSORS && b === CARD_TYPES.PAPER) || (b === CARD_TYPES.SCISSORS && a === CARD_TYPES.PAPER)) {
      return CARD_TYPES.SCISSORS;
    }
    if ((a === CARD_TYPES.ROCK && b === CARD_TYPES.SCISSORS) || (b === CARD_TYPES.ROCK && a === CARD_TYPES.SCISSORS)) {
      return CARD_TYPES.ROCK;
    }
    return CARD_TYPES.PAPER;
  }
}

class SpectatorSystem {
  markEliminated(player, roundNumber) {
    player.alive = false;
    player.spectator = true;
    player.eliminatedRound = roundNumber;
  }
}

class RoundManager {
  constructor({ config, cardDrawSystem, cardSelectionSystem, resultResolver, spectatorSystem, onStateChange }) {
    this.config = config;
    this.cardDrawSystem = cardDrawSystem;
    this.cardSelectionSystem = cardSelectionSystem;
    this.resultResolver = resultResolver;
    this.spectatorSystem = spectatorSystem;
    this.onStateChange = onStateChange;
    this.timer = null;
  }

  clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  begin(match) {
    this.clearTimer();
    match.roundNumber += 1;
    match.phase = "draw";
    match.phaseEndsAt = now() + this.config.drawPhaseMs;
    match.roundResult = null;
    match.dangerCard = this.pickDangerCard(match);

    for (const player of match.players.values()) {
      if (!player.alive) continue;
      player.hand = this.cardDrawSystem.drawHand(match);
      player.selection = null;
      player.locked = false;
      player.automaticSelection = false;
    }

    this.onStateChange();
    this.timer = setTimeout(() => this.startSelection(match), this.config.drawPhaseMs);
  }

  startSelection(match) {
    match.phase = "select";
    match.phaseEndsAt = now() + this.config.choiceTimeMs;
    this.selectForBots(match);
    this.onStateChange();
    this.timer = setTimeout(() => this.forceReveal(match), this.config.choiceTimeMs);
    this.maybeRevealEarly(match);
  }

  submitSelection(match, player, card) {
    const validation = this.cardSelectionSystem.validate({ player, card, phase: match.phase });
    if (!validation.ok) return validation;
    this.cardSelectionSystem.lock(player, card, false);
    this.onStateChange();
    this.maybeRevealEarly(match);
    return { ok: true };
  }

  selectForBots(match) {
    for (const player of match.players.values()) {
      if (player.bot && player.alive && !player.locked) this.cardSelectionSystem.chooseRandom(player);
    }
  }

  maybeRevealEarly(match) {
    if (match.phase !== "select") return;
    const allLocked = Array.from(match.players.values()).filter((player) => player.alive).every((player) => player.locked);
    if (!allLocked) return;
    this.clearTimer();
    this.timer = setTimeout(() => this.forceReveal(match), 350);
  }

  forceReveal(match) {
    if (match.phase !== "select") return;
    this.clearTimer();
    for (const player of match.players.values()) {
      if (player.alive && !player.locked) this.cardSelectionSystem.chooseRandom(player);
    }
    match.phase = "reveal";
    match.phaseEndsAt = now() + this.config.revealTimeMs;
    this.onStateChange();
    this.timer = setTimeout(() => this.resolve(match), this.config.revealTimeMs);
  }

  resolve(match) {
    if (match.phase !== "reveal") return;
    const result = this.resultResolver.resolve({
      players: Array.from(match.players.values()),
      suddenDeath: match.suddenDeath,
      dangerCard: match.dangerCard,
      hardcoreMode: match.hardcoreMode,
    });

    const eliminated = [];
    for (const player of match.players.values()) {
      if (!player.alive) continue;
      player.lastPlayedCard = player.selection;
      if (player.lives <= 0) {
        this.spectatorSystem.markEliminated(player, match.roundNumber);
        eliminated.push({ id: player.id, name: player.name });
      }
    }

    result.eliminated = eliminated;
    result.hadElimination = eliminated.length > 0;
    match.noEliminationRounds = result.hadElimination ? 0 : match.noEliminationRounds + 1;
    match.roundResult = result;
    match.phase = "result";
    match.phaseEndsAt = now() + this.config.resultTimeMs;
    this.onStateChange();

    if (this.finishIfWinner(match)) return;
    this.timer = setTimeout(() => this.finishResult(match), this.config.resultTimeMs);
  }

  finishResult(match) {
    if (match.phase !== "result") return;
    this.activateSuddenDeathIfNeeded(match);
    this.begin(match);
  }

  finishIfWinner(match) {
    const alive = Array.from(match.players.values()).filter((player) => player.alive);
    if (alive.length <= 1) {
      match.phase = "over";
      match.phaseEndsAt = null;
      match.winnerId = alive[0]?.id || null;
      this.clearTimer();
      this.onStateChange();
      return true;
    }
    return false;
  }

  activateSuddenDeathIfNeeded(match) {
    if (match.suddenDeath) return;
    if (now() - match.startedAt < this.config.matchDurationMs) return;
    match.suddenDeath = true;
    match.noEliminationRounds = 0;
    for (const player of match.players.values()) {
      if (player.alive) player.lives = 1;
    }
  }

  pickDangerCard(match) {
    if (!match.suddenDeath) return null;
    const enabled = this.config.suddenDeath.dangerCardsEnabled;
    const threshold = this.config.suddenDeath.noEliminationRoundsBeforeDanger;
    if (!enabled || match.noEliminationRounds < threshold) return null;
    const options = [CARD_TYPES.SCISSORS, CARD_TYPES.ROCK, CARD_TYPES.PAPER, CARD_TYPES.GUARD, CARD_TYPES.PIERCE];
    return options[Math.floor(Math.random() * options.length)];
  }
}

class MatchManager {
  constructor({ config, roundManager, onStateChange }) {
    this.config = config;
    this.roundManager = roundManager;
    this.onStateChange = onStateChange;
    this.players = new Map();
    this.resetMatchState();
  }

  resetMatchState() {
    this.phase = "lobby";
    this.roundNumber = 0;
    this.phaseEndsAt = null;
    this.startedAt = null;
    this.suddenDeath = false;
    this.noEliminationRounds = 0;
    this.dangerCard = null;
    this.roundResult = null;
    this.winnerId = null;
    this.hardcoreMode = this.config.hardcoreMode;
  }

  addHuman(client, name) {
    if (this.players.size >= this.config.maxPlayers) return { ok: false, error: "Lobby is full." };
    if (client.playerId && this.players.has(client.playerId)) return { ok: true, player: this.players.get(client.playerId) };
    const player = new PlayerState({
      id: id("p"),
      name: safeName(name, `Player ${this.players.size + 1}`),
      client,
      host: !Array.from(this.players.values()).some((player) => player.host && !player.bot),
      lives: this.config.startingLives,
    });
    client.playerId = player.id;
    this.players.set(player.id, player);
    this.onStateChange();
    return { ok: true, player };
  }

  addBot() {
    if (this.phase !== "lobby") return { ok: false, error: "Bots can only join in the lobby." };
    if (this.players.size >= this.config.maxPlayers) return { ok: false, error: "Lobby is full." };
    const player = new PlayerState({
      id: id("bot"),
      name: `Bot ${this.players.size + 1}`,
      bot: true,
      lives: this.config.startingLives,
    });
    this.players.set(player.id, player);
    this.onStateChange();
    return { ok: true };
  }

  removeClient(client) {
    const player = this.players.get(client.playerId);
    if (!player) return;
    player.client = null;
    if (this.phase === "lobby") {
      this.players.delete(player.id);
      if (player.host) {
        const nextHuman = Array.from(this.players.values()).find((candidate) => !candidate.bot);
        if (nextHuman) nextHuman.host = true;
      }
    }
    this.onStateChange();
  }

  start({ hardcoreMode }) {
    if (this.phase !== "lobby" && this.phase !== "over") return { ok: false, error: "Match already running." };
    const alivePlayers = Array.from(this.players.values());
    if (alivePlayers.length < 2) return { ok: false, error: "Need at least 2 players or bots." };
    this.roundManager.clearTimer();
    this.resetMatchState();
    this.hardcoreMode = Boolean(hardcoreMode);
    this.startedAt = now();
    for (const player of this.players.values()) {
      player.lives = this.hardcoreMode ? 1 : this.config.startingLives;
      player.alive = true;
      player.spectator = false;
      player.hand = [];
      player.selection = null;
      player.locked = false;
      player.lastPlayedCard = null;
      player.eliminatedRound = null;
    }
    this.roundManager.begin(this);
    return { ok: true };
  }

  selection(playerId, card) {
    return this.roundManager.submitSelection(this, this.players.get(playerId), card);
  }

  publicConfig() {
    return {
      maxPlayers: this.config.maxPlayers,
      startingLives: this.config.startingLives,
      matchDurationMs: this.config.matchDurationMs,
      choiceTimeMs: this.config.choiceTimeMs,
      revealTimeMs: this.config.revealTimeMs,
      cardsDrawnPerRound: this.config.cardsDrawnPerRound,
      cardWeights: this.config.cardWeights,
      hardcoreMode: this.hardcoreMode,
      suddenDeath: this.config.suddenDeath,
    };
  }
}

class LobbyManager {
  constructor({ matchManager, network }) {
    this.matchManager = matchManager;
    this.network = network;
  }

  broadcastState() {
    for (const client of this.network.getAllClients()) {
      this.sendState(client);
    }
  }

  sendState(client) {
    this.network.send(client, {
      type: "game.state",
      state: this.snapshotFor(client.playerId),
    });
  }

  snapshotFor(viewerId) {
    const match = this.matchManager;
    const revealSelections = match.phase === "reveal" || match.phase === "result" || match.phase === "over";
    return {
      config: match.publicConfig(),
      viewerId,
      phase: match.phase,
      roundNumber: match.roundNumber,
      phaseEndsAt: match.phaseEndsAt,
      startedAt: match.startedAt,
      matchDurationMs: GAME_CONFIG.matchDurationMs,
      suddenDeath: match.suddenDeath,
      dangerCard: match.dangerCard,
      winnerId: match.winnerId,
      roundResult: match.roundResult,
      players: Array.from(match.players.values()).map((player) => ({
        id: player.id,
        name: player.name,
        bot: player.bot,
        host: player.host,
        lives: player.lives,
        alive: player.alive,
        spectator: player.spectator,
        locked: player.locked,
        hand: player.id === viewerId && player.alive ? player.hand : [],
        selectedCard: revealSelections ? player.selection : null,
        automaticSelection: revealSelections ? player.automaticSelection : false,
        lastPlayedCard: player.id === viewerId ? player.lastPlayedCard : null,
        eliminatedRound: player.eliminatedRound,
      })),
    };
  }
}

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

let lobbyManager;
let network;

const deckSystem = new DeckSystem(GAME_CONFIG);
const cardDrawSystem = new CardDrawSystem({ deckSystem, config: GAME_CONFIG });
const cardSelectionSystem = new CardSelectionSystem();
const resultResolver = new ResultResolver();
const spectatorSystem = new SpectatorSystem();
const roundManager = new RoundManager({
  config: GAME_CONFIG,
  cardDrawSystem,
  cardSelectionSystem,
  resultResolver,
  spectatorSystem,
  onStateChange: () => lobbyManager?.broadcastState(),
});
const matchManager = new MatchManager({
  config: GAME_CONFIG,
  roundManager,
  onStateChange: () => lobbyManager?.broadcastState(),
});

network = new NetworkManager({
  server,
  onClientMessage: (client, message) => {
    const type = typeof message?.type === "string" ? message.type : "";
    const requestId = String(message?.requestId || "");

    if (type === "lobby.join") {
      const result = matchManager.addHuman(client, message.name);
      if (!result.ok) {
        network.send(client, { type: "game.error", requestId, error: result.error });
        return;
      }
      lobbyManager.sendState(client);
      return;
    }

    if (!client.playerId || !matchManager.players.has(client.playerId)) {
      network.send(client, { type: "game.error", requestId, error: "Join the lobby first." });
      return;
    }

    const player = matchManager.players.get(client.playerId);

    if (type === "lobby.addBot") {
      if (!player.host) {
        network.send(client, { type: "game.error", requestId, error: "Only the host can add bots." });
        return;
      }
      const result = matchManager.addBot();
      if (!result.ok) network.send(client, { type: "game.error", requestId, error: result.error });
      return;
    }

    if (type === "match.start") {
      if (!player.host) {
        network.send(client, { type: "game.error", requestId, error: "Only the host can start the match." });
        return;
      }
      const result = matchManager.start({ hardcoreMode: message.hardcoreMode });
      if (!result.ok) network.send(client, { type: "game.error", requestId, error: result.error });
      return;
    }

    if (type === "card.select") {
      const result = matchManager.selection(client.playerId, message.card);
      if (!result.ok) network.send(client, { type: "game.error", requestId, error: result.error });
      return;
    }
  },
  onClientClose: (client) => {
    matchManager.removeClient(client);
  },
});

lobbyManager = new LobbyManager({ matchManager, network });

setInterval(() => {
  if (matchManager.phase !== "lobby" && matchManager.phase !== "over") lobbyManager.broadcastState();
}, 1000);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Survival RPS server running at http://localhost:${PORT}`);
});
