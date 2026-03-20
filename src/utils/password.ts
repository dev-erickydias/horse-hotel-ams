// ── Password Hashing Utility ─────────────────────────────
// Uses bcryptjs for secure password hashing (Argon2id is not
// available in the browser; bcrypt with 12 rounds is the best
// browser-compatible alternative).

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password using bcrypt.
 * Returns a promise resolving to the hashed string.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a bcrypt hash.
 * Returns true if the password matches.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // If the stored value isn't a bcrypt hash (legacy plaintext),
  // do a direct comparison and flag for migration
  if (!hash.startsWith('$2a$') && !hash.startsWith('$2b$') && !hash.startsWith('$2y$')) {
    return password === hash;
  }
  return bcrypt.compare(password, hash);
}

/**
 * Check if a stored password is still in plaintext (not yet hashed).
 * Used to migrate legacy passwords on login.
 */
export function isPlaintextPassword(stored: string): boolean {
  return !stored.startsWith('$2a$') && !stored.startsWith('$2b$') && !stored.startsWith('$2y$');
}
