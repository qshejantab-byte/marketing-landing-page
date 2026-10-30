/**
 * Marketing & Social Media landing page: single source of configuration.
 *
 * Every business decision, credential and piece of approved content lives
 * here, so replacing placeholders never requires touching the markup.
 * See README.md → "Adding approved work".
 */

/** Review mode shows placeholder guidance for the team. It is on for
 *  localhost by default. ?review=1 forces it on, ?review=0 shows the
 *  production view. */
function detectReviewMode() {
  const flag = new URLSearchParams(location.search).get("review");
  if (flag === "1") return true;
  if (flag === "0") return false;
  return ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
}

export const REVIEW_MODE = detectReviewMode();

export const CONFIG = {
  page: {
    id: "marketing",
    service: "Marketing & Social Media",
  },

  contact: {
    // Confirmed by the business, 30 Oct 2026.
    email: "Richie@todo.rw",
    mainSite: "https://todo.rw/",
    whatsapp: {
      number: "250799537999", // digits only, with country code
      display: "+250 799 537 999",
      message:
        "Hello TODO Growth, I'd like a marketing proposal for my business. Could we talk about what you'd recommend?",
    },
  },

  form: {
    emailRequired: false, // sales policy: email optional
    briefMin: 15,
    briefMax: 800,
  },

  /**
   * Lead delivery through EmailJS (the same account the main todo.rw site
   * uses). The recipient address is set inside the EmailJS template, not
   * here. `to_email` is sent as well, so a template that uses
   * {{to_email}} routes the lead to Richie@todo.rw.
   * Set `enabled: false` to fall back to the honest "not connected" state.
   */
  submission: {
    enabled: true,
    endpoint: "https://api.emailjs.com/api/v1.0/email/send",
    serviceId: "service_tyheci5",
    templateId: "template_0n9539s",
    publicKey: "C7fH5rnk5-9g05t9A",
    timeoutMs: 15000,
  },

  /**
   * APPROVED WORK. Empty until the media team supplies approved material.
   * Each slot in the work wall is filled in order. Unfilled slots show a
   * labelled placeholder. Only add items with written client permission.
   *
   * {
   *   type: "reel" | "post" | "photo" | "campaign",
   *   format: "Reel · 9:16",                  // label shown above the title
   *   client: "Client name",                 // shown as written
   *   title: "Short description of the piece",
   *   alt: "What the image shows",
   *   src: "../assets/media/file-640.webp",   // poster or image
   *   srcset: "../assets/media/file-640.webp 640w, ../assets/media/file-1280.webp 1280w",
   *   video: "../assets/media/file.mp4",      // reels only, muted H.264, ≤ 4 MB
   *   permission: "approved",                 // anything else is ignored
   * }
   */
  work: [],

  /**
   * APPROVED CASE STUDY. null until one is supplied. Results must be
   * verified (source and date range) and signed off by the client.
   *
   * {
   *   client: "Client name", sector: "Hospitality",
   *   headline: "One-line story of the change",
   *   context: "Who they are and who they sell to",
   *   challenge: "The problem, in the client's words",
   *   approach: "What TODO did across strategy, content, launch and measurement",
   *   creative: [{ src, alt }, …],                       // up to 3 frames
   *   results: [{ value: "…", label: "…", source: "Meta Business Suite, Jan–Mar 2027" }],
   *   before: { src, alt }, after: { src, alt },          // same crop and size
   *   permission: "approved",
   * }
   */
  caseStudy: null,
};

export function waLink() {
  const { number, message } = CONFIG.contact.whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
