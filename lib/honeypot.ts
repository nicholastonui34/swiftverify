/**
 * Honeypot field — client-safe (no server-only imports) so both the form
 * components and the server handlers can share the field name and the check.
 * Real users never see or fill this field; bots that autofill it are rejected.
 */
export const HONEYPOT_FIELD = "company_website";

export function isHoneypotTripped(
  value: FormDataEntryValue | string | null | undefined
): boolean {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}
