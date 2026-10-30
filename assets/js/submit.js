/**
 * Submission adapter: the only module that talks to a backend.
 *
 * Returns one of:
 *   { status: "accepted" }          EmailJS answered HTTP 200 (accepted for delivery)
 *   { status: "not_connected" }     submission disabled in config (nothing was sent)
 *   { status: "error", reason }     network, timeout or EmailJS refusal (safe to retry)
 *
 * The UI may show success only for "accepted". EmailJS's 200 means the email
 * was handed to the mail service. Inbox receipt is confirmed separately (README).
 */
import { CONFIG } from "./config.js";

export async function submitLead(templateParams) {
  const s = CONFIG.submission;
  if (!s.enabled || !s.endpoint) return { status: "not_connected" };
  if (navigator.onLine === false) return { status: "error", reason: "offline" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), s.timeoutMs);
  try {
    const res = await fetch(s.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: s.serviceId,
        template_id: s.templateId,
        user_id: s.publicKey,
        template_params: templateParams,
      }),
      signal: ctrl.signal,
      credentials: "omit",
    });
    if (res.ok) return { status: "accepted" };
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 200);
    } catch {
      /* no body */
    }
    return { status: "error", reason: `http_${res.status}`, detail };
  } catch (err) {
    return { status: "error", reason: err && err.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
