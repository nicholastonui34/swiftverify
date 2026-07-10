import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * Visually-hidden, off-screen honeypot input. Excluded from the tab order and
 * hidden from assistive tech so humans never interact with it; spam bots that
 * blindly fill every field trip it and get rejected server-side.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        type="text"
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
