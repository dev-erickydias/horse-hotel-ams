// ── Input Sanitization Utility ───────────────────────────
// Protects against XSS, script injection, and malicious input.
// Applied at the data boundary (create/update) to ensure
// ALL user input is sanitized before persistence.

/**
 * Strip HTML tags, script tags, event handlers, and dangerous patterns
 * from a string value. Preserves safe text content.
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') return value;

  let clean = value;

  // Remove script tags and their content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags and their content
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove all HTML tags
  clean = clean.replace(/<[^>]*>/g, '');

  // Remove javascript: protocol patterns
  clean = clean.replace(/javascript\s*:/gi, '');

  // Remove data: protocol patterns (can be used for XSS)
  clean = clean.replace(/data\s*:\s*text\/html/gi, '');

  // Remove vbscript: protocol patterns
  clean = clean.replace(/vbscript\s*:/gi, '');

  // Remove on* event handler patterns (onclick, onerror, onload, etc.)
  clean = clean.replace(/\bon\w+\s*=/gi, '');

  // Remove expression() CSS patterns
  clean = clean.replace(/expression\s*\(/gi, '');

  // Remove eval() patterns
  clean = clean.replace(/eval\s*\(/gi, '');

  // Remove document.cookie patterns
  clean = clean.replace(/document\s*\.\s*cookie/gi, '');

  // Remove document.write patterns
  clean = clean.replace(/document\s*\.\s*write/gi, '');

  // Remove window.location patterns
  clean = clean.replace(/window\s*\.\s*location/gi, '');

  // Trim whitespace
  clean = clean.trim();

  return clean;
}

/**
 * Recursively sanitize all string values in an object.
 * Handles nested objects and arrays.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      // Skip sanitization for certain fields that should not be modified
      if (key === 'id' || key === 'createdAt' || key === 'archivedAt') {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized as T;
  }

  return obj;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Enforce maximum length on a string
 */
export function enforceMaxLength(value: string, max: number): string {
  if (typeof value !== 'string') return value;
  return value.slice(0, max);
}

/**
 * Validate and sanitize a phone number (allow only digits, spaces, +, -, parentheses)
 */
export function sanitizePhone(value: string): string {
  if (typeof value !== 'string') return value;
  return value.replace(/[^\d\s+\-()]/g, '').trim();
}
