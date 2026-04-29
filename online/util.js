const crypto = require("crypto");

function now() {
  return Date.now();
}

function randomId(prefix = "") {
  return `${prefix}${crypto.randomBytes(8).toString("hex")}`;
}

function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function safeString(value, maxLen, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

function hashPassword(password, salt) {
  // Not meant to be production-secure; good enough for a prototype.
  return crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

module.exports = {
  now,
  randomId,
  clampNumber,
  safeString,
  hashPassword,
};

