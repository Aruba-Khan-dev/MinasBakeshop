import { ADMIN_EMAIL } from '@/lib/supabase/middleware';

export { ADMIN_EMAIL };

/** Normalize email for login (fixes common @gmail typo without .com). */
export function normalizeAdminEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  if (trimmed === 'minasbakeshopp@gmail') {
    return ADMIN_EMAIL.toLowerCase();
  }
  return trimmed;
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return normalizeAdminEmail(email) === ADMIN_EMAIL.toLowerCase();
}
