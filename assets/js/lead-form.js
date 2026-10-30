/**
 * Proposal form: validation, email composition and honest submission states.
 * Success is shown only when the submission adapter returns "accepted".
 * Validation and phone normalisation follow the Virtual Tours form.
 */
import { CONFIG, REVIEW_MODE } from "./config.js";
import { submitLead } from "./submit.js";

const checkedNeeds = (form) => [...form.querySelectorAll('input[name="needs"]:checked')].map((i) => i.value);

const RULES = {
  name: (v) => (v.length < 2 ? "Please enter your name." : v.length > 80 ? "Please keep your name under 80 characters." : ""),
  business: (v) =>
    v.length < 2 ? "Please enter your business or organisation." : v.length > 120 ? "Please keep this under 120 characters." : "",
  phone: (v) => (normalisePhone(v) ? "" : "Enter a phone or WhatsApp number, for example 078 123 4567 or +250 78 123 4567."),
  email: (v) => {
    if (!v) return CONFIG.form.emailRequired ? "Please enter your email address." : "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address, for example name@business.com.";
  },
  needs: (_v, form) => (checkedNeeds(form).length ? "" : "Please choose at least one option, or “Not sure yet”."),
  brief: (v) => {
    const { briefMin: min, briefMax: max } = CONFIG.form;
    if (v.length < min) return `Please add a few words about your business (at least ${min} characters).`;
    if (v.length > max) return `Please keep this under ${max} characters.`;
    return "";
  },
};

/** Returns +E.164 or null. Local Rwandan formats (07…, 7…) gain +250. */
export function normalisePhone(raw) {
  let v = String(raw || "").replace(/[\s().\-]/g, "");
  if (v.startsWith("00")) v = "+" + v.slice(2);
  if (/^0?7\d{8}$/.test(v)) return "+250" + v.slice(-9);
  if (/^\+?\d{9,15}$/.test(v)) return v.startsWith("+") ? v : "+" + v;
  return null;
}

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function mountLeadForm(section) {
  if (!section) return;
  const form = section.querySelector("[data-lead-form]");
  const submitBtn = form.querySelector("[type=submit]");
  const label = submitBtn.querySelector("[data-label]");
  const idleLabel = label.textContent;
  const summary = form.querySelector("[data-form-summary]");
  const notice = section.querySelector("[data-form-notice]");
  const success = section.querySelector("[data-form-success]");
  const counter = form.querySelector("[data-brief-count]");
  const names = Object.keys(RULES);

  form.elements.email.required = CONFIG.form.emailRequired;
  const marker = form.querySelector("[data-email-marker]");
  if (marker && CONFIG.form.emailRequired) {
    marker.className = "req";
    marker.textContent = "*";
  }
  form.elements.brief.maxLength = CONFIG.form.briefMax;
  if (counter) counter.textContent = `0 / ${CONFIG.form.briefMax}`;

  let attempted = false;
  let inFlight = false;

  const value = (n) => (n === "needs" ? "" : (form.elements[n].value || "").trim());
  const check = (n) => RULES[n](value(n), form);

  function setError(n, msg) {
    const err = form.querySelector(`#lf-${n}-error`);
    if (n === "needs") {
      const fs = form.querySelector("fieldset.chips");
      fs.classList.toggle("has-error", Boolean(msg));
      fs.setAttribute("aria-invalid", msg ? "true" : "false");
    } else {
      const input = form.elements[n];
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      input.closest(".field").classList.toggle("has-error", Boolean(msg));
    }
    if (err) err.textContent = msg;
  }

  function validate() {
    const bad = [];
    for (const n of names) {
      const msg = check(n);
      setError(n, msg);
      if (msg) bad.push(n);
    }
    return bad;
  }

  const focusField = (n) => (n === "needs" ? form.querySelector('input[name="needs"]') : form.elements[n]).focus();

  function showSummary(text) {
    summary.textContent = text;
    summary.hidden = !text;
  }
  const countText = (k) => `${k} ${k === 1 ? "field needs" : "fields need"} attention.`;

  form.addEventListener("input", (e) => {
    const n = e.target.name;
    if (n === "brief" && counter) counter.textContent = `${e.target.value.length} / ${CONFIG.form.briefMax}`;
    if (attempted && RULES[n]) {
      setError(n, check(n));
      const remaining = names.filter((x) => check(x)).length;
      showSummary(remaining ? countText(remaining) : "");
    }
  });
  form.addEventListener(
    "blur",
    (e) => {
      const n = e.target.name;
      if (RULES[n] && n !== "needs" && value(n)) setError(n, check(n));
    },
    true,
  );

  function collect() {
    const phone = normalisePhone(value("phone"));
    return {
      name: value("name"),
      business: value("business"),
      phone: phone || value("phone"),
      whatsapp_ok: form.elements.whatsapp_ok.checked,
      email: value("email"),
      needs: checkedNeeds(form),
      brief: value("brief"),
      page_url: location.href,
      referrer: document.referrer || "",
      submitted_at: new Date().toISOString(),
    };
  }

  function composeMessage(d) {
    return [
      `New ${CONFIG.page.service} enquiry from the landing page`,
      "",
      `Name: ${d.name}`,
      `Business: ${d.business}`,
      `Phone / WhatsApp: ${d.phone}${d.whatsapp_ok ? " (WhatsApp OK)" : " (no WhatsApp)"}`,
      `Email: ${d.email || "not given"}`,
      `Interested in: ${d.needs.join(", ")}`,
      "",
      "Brief:",
      d.brief,
      "",
      "—",
      `Page: ${d.page_url}`,
      d.referrer ? `Referrer: ${d.referrer}` : null,
      `Submitted: ${d.submitted_at}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  /* Template parameters. The existing todo.rw contact template uses
     name / reply_to / company / message. The rest are available to a
     dedicated template later. */
  function templateParams(d) {
    return {
      name: d.name,
      reply_to: d.email,
      company: d.business,
      message: composeMessage(d),
      subject: `Marketing proposal request: ${d.business}`,
      to_email: CONFIG.contact.email,
      phone: d.phone,
      whatsapp_ok: d.whatsapp_ok ? "yes" : "no",
      email: d.email || "not given",
      service: CONFIG.page.service,
      needs: d.needs.join(", "),
      brief: d.brief,
      page_url: d.page_url,
    };
  }

  function mailtoHref(d) {
    return `mailto:${CONFIG.contact.email}?subject=${encodeURIComponent(
      `Marketing proposal request: ${d.business}`,
    )}&body=${encodeURIComponent(composeMessage(d))}`;
  }

  function showNotice(kind, html) {
    notice.dataset.kind = kind;
    notice.innerHTML = html;
    notice.hidden = false;
    notice.focus();
  }

  function setBusy(on) {
    inFlight = on;
    submitBtn.disabled = on;
    form.setAttribute("aria-busy", String(on));
    submitBtn.classList.toggle("is-busy", on);
    label.textContent = on ? "Sending…" : idleLabel;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (inFlight) return; // duplicate-submit guard
    attempted = true;
    notice.hidden = true;

    const bad = validate();
    if (bad.length) {
      showSummary(countText(bad.length));
      focusField(bad[0]);
      return;
    }
    showSummary("");

    // Honeypot: bots fill hidden fields. Do nothing and claim nothing.
    if (form.elements.website.value) return;

    const data = collect();
    setBusy(true);
    const result = await submitLead(templateParams(data));
    setBusy(false);

    const email = escapeHtml(CONFIG.contact.email);
    const mailto = escapeHtml(mailtoHref(data));
    const wa = section.querySelector("[data-wa]")?.href || "#";

    if (result.status === "accepted") {
      form.hidden = true;
      success.hidden = false;
      success.querySelector("h3").focus();
      return;
    }

    if (result.status === "not_connected") {
      showNotice(
        "warn",
        `<p class="notice-title">Online enquiries are not connected right now. Nothing has been sent.</p>
         <p>Your details are still in the form. Send them by email (your email app opens with everything filled in) or message us on WhatsApp.</p>
         <a class="btn btn-ink" href="${mailto}">Email these details to ${email}</a>
         <a class="btn btn-wa" href="${escapeHtml(wa)}" rel="noopener" target="_blank">WhatsApp us instead</a>`,
      );
      return;
    }

    const offline = result.reason === "offline";
    showNotice(
      "error",
      `<p class="notice-title">${offline ? "You appear to be offline." : "We couldn't send your enquiry just now."} It has not been received.</p>
       <p>Your details are still in the form. Please try again${offline ? " when you're connected" : ""}, email them to us or message us on WhatsApp.</p>
       <a class="btn btn-ink" href="${mailto}">Email these details instead</a>
       <a class="btn btn-wa" href="${escapeHtml(wa)}" rel="noopener" target="_blank">WhatsApp us instead</a>
       ${REVIEW_MODE ? `<p class="notice-dev">Review mode: ${escapeHtml(result.reason || "")} ${escapeHtml(result.detail || "")}</p>` : ""}`,
    );
  });
}
