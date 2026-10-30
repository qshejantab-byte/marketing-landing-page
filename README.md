# TODO Growth: Marketing & Social Media landing page

A static, dependency-free landing page with no build step. It is built from the *TODO Growth Meta Advertising & Landing Page Blueprint* (v1.0) and [docs/MARKETING_LANDING_PAGE_DISCOVERY.md](docs/MARKETING_LANDING_PAGE_DISCOVERY.md) (approved direction: **B, "Impossible to Ignore"**, with Direction A's mobile ideas).

- **Locally:** <http://localhost/marketing%20landing%20page/marketing/>
- **Intended live route:** `https://todo.rw/marketing/` (canonical). The root `index.html` forwards to `marketing/` and keeps the query string.

```
marketing/index.html        the page (all content is in the HTML, so it reads without JS)
assets/css/marketing.css    design system "Impossible to Ignore"
assets/js/config.js         ← contact details, form delivery, approved work, case study
assets/js/main.js           noise walls, tune-in reveals, signal scope, work wall, compare slider, dock, review bar
assets/js/lead-form.js      validation, email composition, honest states
assets/js/submit.js         EmailJS REST adapter (the only backend touchpoint)
assets/img/brand/           TODO logo
assets/media/               put approved work here
```

## Page flow

| # | Section | Signature moment |
|---|---|---|
| 1 | Hero (fog) | Three depth layers of look-alike posts. The H1 arrives word by word, then two Sun slabs snap in. The phone feed scrolls, brakes and stops on the one colour post: the rest blurs, "Stopped" appears and a card breaks out of the frame (about every 7 s) |
| 2 | Sound familiar? | Five "posts from your business", one per problem. Each label gets a Sun highlight on reveal |
| 3 | The shift (pinned, 260vh) | The grey feed splits like doors, colour floods in and "Let's fix that." wipes in. Reduced motion or no JS: static final frame, no pinning |
| 4 | How it connects | Sticky scope: a noisy line resolves stage by stage. Each stage has What we do / You receive / Why it matters / hand-off |
| 5 | The work | Desktop: a selectable phone stage + numbered index (hover, click or keyboard). Below 1024px: a swipe rail with story progress bars |
| 6 | Case study | Five chapters + before/after slider. **Production: hidden until `CONFIG.caseStudy` is approved** |
| 7 | Services | Plan / Make / Run bands with wipe reveals. All nine blueprint services |
| 8 | Proposal (Sun) | The form, with a "Your brief: x of 5" meter |
| 9 | Close | A spotlight that pulls colour out of the noise (follows the cursor; drifts on touch) |

Performance: decorative loops pause off-screen; the feed and scope stop their animation frames when hidden; there is one rAF-throttled scroll handler; the colour spotlight uses a registered custom property. About 3,000 DOM nodes on desktop and 2,000 on mobile (the noise walls halve on small screens). About 140 KB of HTML/CSS/JS uncompressed, with no images except the logo.

## Review mode

| URL | What you see |
|---|---|
| `localhost` (default) or `?review=1` | A review bar listing open items. The **case study / before-after** section is shown with placeholders. Form errors show technical detail. |
| any other host or `?review=0` | Production view. The case study stays hidden until one is approved. Work placeholders stay visible and are labelled "Placeholder". |

## Adding approved work (media team)

1. Export each piece as WebP at 640 and 1280 px wide. Reels are MP4 (H.264, muted-friendly, ≤ 4 MB) plus a poster image. Put the files in `assets/media/`.
2. Add one entry per piece to `CONFIG.work` in `assets/js/config.js` (the format is documented there), with `permission: "approved"`.
3. The first approved items replace the six placeholders in order, and any leftover placeholders are removed automatically. Reels autoplay muted while on screen and have a "Sound on" button. With reduced motion they don't autoplay.
4. Case study: fill `CONFIG.caseStudy` (client, challenge, approach, deliverables, **verified** results with source, and before/after images) with `permission: "approved"`. The section then appears in production with a draggable, keyboard-accessible before/after slider.

Only add work with written client permission. Never present AI-generated images, or photography TODO did not produce, as TODO marketing work.

## Lead form and delivery

- Fields follow the blueprint: name, business, phone/WhatsApp (normalised to +250…), email (optional), what they need (at least one) and a short brief. There is also a honeypot field.
- Delivery: EmailJS REST API, using the same account and **contact template (`template_0n9539s`)** as todo.rw. It sends `name`, `reply_to` and `company`, plus `message` (the full enquiry including the page URL). It also sends `to_email=Richie@todo.rw`, `phone`, `needs`, `brief`, `service` and `page_url` for a dedicated template.
- Success is shown **only** when EmailJS answers HTTP 200. Errors keep the visitor's details and offer a pre-filled email to Richie@todo.rw and WhatsApp.
- **Live test, 30 Oct 2026: FAILED, nothing was sent.** EmailJS returned `412 Outlook: Invalid grant. Please reconnect your Outlook account`. The Outlook connection on service `service_tyheci5` must be reconnected in the EmailJS dashboard. The todo.rw contact and discovery forms use the same service. Then:
  1. In the template settings, confirm "To Email" is `Richie@todo.rw` (or `{{to_email}}`).
  2. Submit one test from the page and confirm it arrives in the inbox.
- To switch online sending off, set `CONFIG.submission.enabled = false`. The form then honestly says it isn't connected and offers email or WhatsApp instead.

## WhatsApp

`+250 799 537 999` (confirmed 30 Oct 2026). Every WhatsApp link uses `CONFIG.contact.whatsapp` with the prefilled message *"Hello TODO Growth, I'd like a marketing proposal for my business…"*.

## Out of scope (by decision)

No Meta Pixel, advertising tracking, Conversions API or campaign configuration. The enquiry email includes the page URL (and so any UTM parameters in it) and the referrer, so sales can see where a lead came from. No cookies or third-party scripts are loaded, apart from Google Fonts and the EmailJS request made when someone submits the form.
