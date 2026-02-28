/**
 * Shared server-side validation utilities
 */

/**
 * RFC 5322–inspired email validation pattern.
 * Requires: local part, @, domain with at least one dot, and a TLD of 2+ chars.
 * Rejects: missing TLD ('user@domain'), empty domain parts ('user@.com'),
 *          leading/trailing dots, and consecutive dots.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
