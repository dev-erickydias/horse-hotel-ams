/**
 * Standalone reset token store using localStorage.
 * Tokens are short-lived (1 hour), single-use, and independent
 * of the user table schema or Supabase columns.
 *
 * Security:
 * - 256-bit cryptographic tokens
 * - 1-hour expiry
 * - Single-use (cleared after successful reset)
 * - Auto-cleanup of expired tokens
 * - Rate limiting (3 requests per email per 5 minutes)
 */

const STORAGE_KEY = 'hh_reset_tokens';
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_KEY = 'hh_reset_rate';

interface ResetEntry {
  email: string;
  expiry: number; // timestamp ms
  createdAt: number;
}

type TokenMap = Record<string, ResetEntry>;

// ── Token generation ──────────────────────────────────
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Read/write helpers ────────────────────────────────
function readTokens(): TokenMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const map: TokenMap = JSON.parse(raw);
    // Auto-cleanup expired tokens
    const now = Date.now();
    let changed = false;
    for (const [token, entry] of Object.entries(map)) {
      if (entry.expiry < now) {
        delete map[token];
        changed = true;
      }
    }
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return map;
  } catch {
    return {};
  }
}

function writeTokens(map: TokenMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// ── Rate limiting ─────────────────────────────────────
interface RateEntry {
  count: number;
  windowStart: number;
}

type RateMap = Record<string, RateEntry>;

function readRates(): RateMap {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeRates(map: RateMap): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(map));
}

export function isResetRateLimited(email: string): boolean {
  const rates = readRates();
  const entry = rates[email];
  if (!entry) return false;
  if (Date.now() - entry.windowStart > RATE_LIMIT_WINDOW_MS) return false;
  return entry.count >= RATE_LIMIT_MAX;
}

function recordAttempt(email: string): void {
  const rates = readRates();
  const entry = rates[email];
  const now = Date.now();
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rates[email] = { count: 1, windowStart: now };
  } else {
    entry.count++;
  }
  writeRates(rates);
}

// ── Public API ────────────────────────────────────────

/** Create a reset token for an email. Returns the token string. */
export function createResetToken(email: string): string {
  recordAttempt(email);
  const token = generateToken();
  const map = readTokens();

  // Remove any existing tokens for the same email (only 1 active per user)
  for (const [t, entry] of Object.entries(map)) {
    if (entry.email === email) delete map[t];
  }

  map[token] = {
    email,
    expiry: Date.now() + TOKEN_EXPIRY_MS,
    createdAt: Date.now(),
  };
  writeTokens(map);
  return token;
}

/** Look up a token. Returns the email if valid, or null if invalid/expired. */
export function validateResetToken(token: string): string | null {
  const map = readTokens();
  const entry = map[token];
  if (!entry) return null;
  if (entry.expiry < Date.now()) {
    // Expired — clean up
    delete map[token];
    writeTokens(map);
    return null;
  }
  return entry.email;
}

/** Consume (invalidate) a token after successful password reset. */
export function consumeResetToken(token: string): void {
  const map = readTokens();
  delete map[token];
  writeTokens(map);
}
