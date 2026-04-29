const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const PLAYERS_PATH = path.join(DATA_DIR, "players.json");
const LEGACY_USERS_PATH = path.join(DATA_DIR, "users.json");

function ensureDataDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (_) {
    // ignore
  }
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDataDir();
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeStore(data) {
  if (data?.players && typeof data.players === "object") {
    return { players: data.players };
  }
  if (data?.users && typeof data.users === "object") {
    return { players: data.users };
  }
  return { players: {} };
}

function loadPlayers() {
  ensureDataDir();
  if (fs.existsSync(PLAYERS_PATH)) {
    return normalizeStore(readJson(PLAYERS_PATH, { players: {} }));
  }
  const legacy = normalizeStore(readJson(LEGACY_USERS_PATH, { players: {} }));
  if (Object.keys(legacy.players).length > 0) {
    savePlayers(legacy.players);
  }
  return legacy;
}

function savePlayers(players) {
  writeJson(PLAYERS_PATH, { players });
}

module.exports = {
  loadPlayers,
  savePlayers,
  PLAYERS_PATH,
  LEGACY_USERS_PATH,
};
