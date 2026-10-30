# TODO Growth — Marketing & Social Media Landing Page
## Phase 1 Discovery: Requirements, Content and Creative Direction

**Date:** 30 October 2026 · **Status:** Audit and planning only. No source code was changed, nothing was installed, committed or deployed.
**Target route (blueprint):** `/marketing` · **Primary CTA:** Get a Marketing Proposal

**Evidence key:** **[B]** stated in the Blueprint · **[S]** stated in the Services Website Copy PDF · **[C]** found in existing code/assets · **[U]** unverified, needs approval · **[R]** recommendation.

**Sources examined**

| Source | Location | Notes |
|---|---|---|
| Meta Advertising & Landing Page Blueprint v1.0 (22 Oct 2026) | `Downloads/TODO_Growth_Meta_Landing_Pages_Blueprint (1).pdf` | Source of truth. A second copy without "(1)" exists and differs at byte level. Text was not compared; confirm which is final. |
| Services Website Copy | `Downloads/TODO_Growth_Services_Website_Page.pdf` | Older positioning, services and draft prices ("validate before publication"). |
| Main site, React/Vite (Lovable) | `htdocs/todo/` | The current production codebase and design system. |
| Earlier static HTML site | `htdocs/todo-html/` | Superseded version. It contains unverified statistics (see §7). |
| Virtual Tours landing page | `htdocs/virtualtourlandingpage/` | Sibling page built from the same blueprint. It sets the technical pattern for this page. |
| Grotta Resort site and media | `htdocs/grottachristmas/` | 272 images. Some are real photography, some are AI-generated. |
| SVF Strategic Communications Agreement | `Downloads/SVF_Todo_Growth_..._Agreement.docx` | A client contract. **Not opened and not to be used as public proof** without permission. |

The working folder `marketing landing page/` was empty before this report.

---

## 1. Blueprint requirements

### 1.1 Page-specific (Phase 01 + Phase 04) [B]
- **Core promise:** "Marketing that makes the business difficult to ignore and gives each campaign a clear path to enquiry."
- **Hero:** "Marketing That Makes Your Business Impossible to Ignore."
- **Included services:** strategy, content production, photography, video/reels, social media management, Meta advertising, campaign development, landing pages, lead generation.
- **Lead with** real content, posts, reels, photography and campaign work.
- **Explain** how strategy, content, advertising and lead generation connect.
- **Show** approved transformations and verified campaign outcomes.
- **Proof required:** real work, approved portfolio examples, campaign visuals, verified outcomes where available.
- **Process:** Strategy → Create → Launch → Measure.
- **Ad hook (Phase 08):** "Great business. Weak social media? Let's fix that." The proof format is a before/after portfolio and reels. The ad promise must match the landing-page headline and proof.
- **Retargeting:** marketing visitors are shown an approved case study or work transformation. The page should therefore have a case study that can stand alone as a deep-link target.

### 1.2 Conversion framework, 11 parts (Phase 03) [B]
1. Hero: service, value and next action in the first screen, with one primary CTA and one secondary proof CTA.
2. Immediate proof, shown before any long explanation.
3. Customer problem: specific friction, no generic agency language.
4. TODO solution, as a short process.
5. Case studies: client, challenge, solution, deliverables, visual proof, verified results.
6. What is included: tangible deliverables.
7. Who it is for: priority industries and how the service applies to each.
8. Trust: genuine logos, testimonials and samples, used with permission.
9. Lead form: only what is needed to start a useful conversation.
10. WhatsApp route: contextual label and a prefilled, service-specific message.
11. Final CTA: restate the value and offer the form and WhatsApp.

### 1.3 Lead form [B]
| Field | Requirement |
|---|---|
| Name | Required |
| Business / organisation | Required |
| Phone / WhatsApp | Required |
| Email | Optional, or required by sales policy |
| Service interested in | Required (on this page: preset to Marketing, with sub-interest) |
| Brief project description | Required |

Form rule: "The first form should open the conversation, not replace discovery." The Services PDF also suggests budget range and launch date [S]. The blueprint's minimal form takes precedence. Budget is at most an optional field, and only if sales asks for it.

### 1.4 Tracking, privacy, routing (Phases 05–07, 12) [B]
- Every lead carries the landing page, campaign, ad/creative ID and UTMs where available.
- Meta events: PageView, ViewContent (defined engagement), Lead (successful submission only), Contact (WhatsApp intent). CAPI is evaluated with event-ID deduplication.
- Trackers load only under the chosen consent approach. A privacy policy is published, and the page explains how TODO will contact the person.
- Launch gate: no campaign goes live until the whole journey has been tested end to end (ad → page → CTA → form/WhatsApp → event → lead received → source identifiable → owner assigned).

### 1.5 Performance and compatibility [B]
- Mobile first, tested from 320 px upward.
- Images and video optimised "without making proof unclear".
- No heavy animation that delays understanding or access to the CTA.
- Tested inside the Facebook and Instagram in-app browsers.
- Forms and WhatsApp links tested on common Android and iPhone devices.

---

## 2. Existing website audit

### 2.1 Brand identity [C]
**Main site design tokens** (`todo/src/index.css`):

| Token | Value |
|---|---|
| Paper | `#f7f5ef`, `#efebe1`, `#e2dccd` |
| Ink (primary dark) | `#161838`, `#21244b`, `#363a68` |
| Graphite | `#4f5270` |
| Sun (signature accent) | `#ffc83d` / `#f2a900` |
| Secondary accents | violet `#5b3fe0`, pink `#f2478b`, teal `#14b592`, sky `#3d9ef0`, tangerine `#ff7a2e` |

Contrast ratios are documented inline.

**Type:**
- Display: **Bricolage Grotesque** (800).
- Body: **Schibsted Grotesk**.
- Both load from Google Fonts.

**Shape language:**
- Thick 2 px ink outlines and "edge" offset shadows.
- Rounded tiles (radius 1.75 rem).
- Defined motion tokens, including a 700 ms reveal.

**Logo:** `todo/src/assets/LOGO.png` and `logo-160.png`. A webp version is in `virtualtourlandingpage/assets/img/brand/`.

**Brand idea:** "growth in motion". The site sequence is Strategy → Creativity → Technology → Execution → Growth.

The Virtual Tours page uses its own "Plan & Aperture" system: plaster paper, ink, Space Mono annotations and dark apertures. Its own audit criticised it for stitching two systems together and for noisy numbering.

### 2.2 Structure and navigation [C]
- Navigation: Home, Services, Packages, Industries, Work, About, Contact (`todo/src/lib/site.ts`).
- Site-wide CTAs: "Book a discovery call" (`/discovery`) and "Request a quote" (`/contact#enquiry`).
- **Services**, **About** and **Work** are Stage 1 placeholders. Work literally says "Case studies are being prepared." and is set to `noindex`.
- There is **no marketing service page and no portfolio** on the live codebase.

### 2.3 Marketing content that already exists
- Services PDF [S]. **Content Production** covers photography and cinematic video, drone coverage, social content packs and event coverage. **Digital Marketing** covers social media management, ad campaign support, Google Business optimisation, SEO and influencer campaigns ("Monthly packages available").
- Positioning [S]: Rwanda-based team. Hospitality, tourism, real estate and NGOs are the focus sectors.
- Draft packages [S]: Starter Growth ($750) and Business Growth ($1,500, includes social media management, ad campaign setup and monthly reporting). Both carry the note "Prices should be validated internally before publication."
- `todo-html` lists cores ("Content Production: Visuals that stop scrolls and start sales"), industry blurbs and a "Proof, not promises" / "Trusted by hospitality leaders" section. **The figures and claims there are not evidenced** (§7).

### 2.4 Contact, enquiry and integrations [C]
| Item | Found | Status |
|---|---|---|
| Email | `Richie@todo.rw` (main site), `info@todo.rw` (VT page) | [U] Which inbox receives marketing leads? |
| WhatsApp | `250794003368` (main site code), `250799537999` (live site per VT audit) | **[U] Conflict.** It must be confirmed before any WhatsApp CTA ships. |
| Location | Kigali, Rwanda | Consistent |
| Forms | EmailJS (`service_tyheci5`, templates `template_0n9539s` contact / `template_q0zx8tz` discovery) on the main site | Present in code. **Delivery was not tested in this audit**, and there is no UTM/source capture. |
| VT page submission | `submit.js` adapter, `endpoint: null` | Not connected. The form honestly offers an email fallback. |
| Meta Pixel / CAPI | VT `tracking.js` adapter, `metaPixelId: null`, consent always false | No Pixel ID, consent mechanism or privacy policy exists. |
| Social profiles | No Instagram/Facebook/TikTok URLs found in either codebase | [U] Needed for the "follow the work" link and for sourcing real posts. |

### 2.5 Reusable components and constraints [C]
- **Main site:** React 19, Vite 7, Tailwind 4, Radix/shadcn UI, react-hook-form + zod, EmailJS and Helmet. It has a system layer (`components/system`: Button, Card, Field, Media, Sequence, Tile, layout, type) and `use-in-view` / `use-canvas-loop` hooks. It was built with Lovable and deploys with Cloudflare `wrangler`.
- **VT landing page:** static, no build step and no dependencies. Its reusable modules are directly relevant:
  - `config.js` launch gates
  - `attribution.js` (first-touch UTM/fbclid with an in-app-browser fallback)
  - `lead-form.js` (honest states)
  - `submit.js`
  - `tracking.js` (consent-gated)
  - review mode versus production view for unapproved content
- **Constraint:** this folder is not a git repository and has no build tooling. The blueprint's URL is `/marketing` on the main domain, and hosting/routing for the landing pages has not been decided [U].

---

## 3. Available assets and missing assets

### 3.1 Available, potentially usable (all need permission confirmation)
| Asset | Location | Value for this page | Caveat |
|---|---|---|---|
| TODO logo | `todo/src/assets/`, VT `img/brand/` | Brand | Approved brand asset |
| Brand tokens and fonts | `todo/src/index.css` | Visual continuity with todo.rw | — |
| Grotta Resort photography, ~240 camera files (`AV7I*.jpg`, `DSF*.jpeg`) | `grottachristmas/images/` | **The strongest real proof available:** professional hospitality photography | [U] Who shot it (TODO or the resort)? Is it permitted in paid-ad landing pages? |
| Grotta campaign site (Christmas / events / stay) | `grottachristmas/` | Possible "campaign development + landing page" example | [U] Was it built by TODO, and was it live? Any results? |
| Grotta room photography (webp, 3 sizes) | VT `img/portfolio/` | Cross-sell to Virtual Tours | Marked as pending permission in VT config |
| SVF client relationship | Agreement `.docx` | Possible strategic-communications case study | Confidential contract. Use only with written consent and the agreed public wording. |

### 3.2 Must be excluded
- **AI-generated images** in `grottachristmas/images/` (`Gemini_Generated_Image_*`, `ChatGPT Image *`) and the Christmas composites at the root (`christmas-*.png/jpg`, origin unclear). They must never be presented as TODO photography or campaign proof.
- All statistics and testimonials in `todo-html` (§7).

### 3.3 Missing: blocks the page as specified
1. **Social posts and carousels** (exported images, or screenshots with the client's permission).
2. **Reels/short video**: vertical MP4 sources plus poster frames, 6–20 s cuts.
3. **Before/after transformations**: a client feed or brand presence before TODO and after. This is the blueprint's ad-hook proof format.
4. **Verified campaign outcomes**: platform screenshots or exports (reach, leads, CPL, enquiries, bookings), with a date range and client approval.
5. **At least one approved case study**: client, challenge, solution, deliverables, visuals, results.
6. **Client logos and testimonials**, with written permission.
7. **Confirmed WhatsApp number**, lead inbox, social profile URLs, privacy policy, Pixel ID and consent approach.
8. **Package/pricing decision:** publish "from" prices or not.

**If items 1–5 do not arrive, the page cannot honestly "lead with real work".** The fallback is in §9, Gate A.

---

## 4. Proposed page structure

One page, no duplicate sections, about 6–7 mobile screens before the form. Each block maps to the blueprint framework (numbers in brackets).

| # | Section | Purpose | Content |
|---|---|---|---|
| 1 | **Hero** [1] | Attention: promise, proof and action in one screen | The approved H1. A one-line support line on making each campaign a clear path to enquiry. Primary button **Get a Marketing Proposal** (scrolls to the form). Secondary button **See the work** (jumps to the proof). The hero visual *is* real work (see the directions), not decoration. |
| 2 | **The work** [2] | Interest: show before telling | A curated set of 8–12 real pieces: reels (muted autoplay only when in view), posts, photography and a campaign. Each piece carries a small caption with client, format and objective. A filter is optional; the default order is "best first". |
| 3 | **The problem** [3] | Recognition | One sharp statement built from the ad hook: *a great business with weak social media*. Three concrete frictions: posting without a plan, content that looks like everyone else's, and ads that get likes but no enquiries. Text only. No icon card grid. |
| 4 | **How it connects** [4 + blueprint "explain how strategy, content, advertising and lead generation connect"] | Understanding | One continuous diagram: **Strategy → Create → Launch → Measure**. Each stage is anchored to a real artefact from section 2 (a content plan excerpt, a shoot frame, a live ad, a lead/report view). It ends at the enquiry, so the page visibly practises what it sells. |
| 5 | **Transformation + case study** [5] | Trust through evidence | One deep, approved case study, deep-linkable (`#case-…`) for retargeting. It includes a before/after slider, challenge, what TODO did, deliverables and **verified** results only. A second, shorter case is optional. |
| 6 | **What's included** [6] | Remove uncertainty | The nine blueprint deliverables in three plain groups: *Plan* (strategy, campaign development), *Make* (content, photography, video/reels), *Run* (social management, Meta ads, landing pages, lead generation). It also covers how engagements start (proposal → scope). No prices unless approved. |
| 7 | **Who it's for** [7] | Self-qualification | Hospitality, tourism, real estate, NGOs [S]. One sentence each on what marketing does for that sector. These are not presented as client lists. |
| 8 | **Trust strip** [8] | Reassurance before the ask | Approved logos and testimonial(s), the Kigali team and links to TODO's own social profiles. If nothing is approved it is **omitted**, not padded. |
| 9 | **Proposal form** [9] | Enquiry | The blueprint fields: name, business, phone/WhatsApp, email (per policy), what you need (chips: Social media management · Content/photo/video · Meta ads & lead generation · Full marketing plan) and a short brief. The privacy line says how TODO will contact them. It has honest success and failure states. |
| 10 | **WhatsApp route** [10] | Low-friction alternative | Placed beside the form, plus a sticky mobile bar after the hero: "Ask about marketing on WhatsApp". Prefilled message: *"Hello TODO Growth, I'd like a marketing proposal for my business. Can we talk?"* It appears only once the number is confirmed. |
| 11 | **Final CTA + footer** [11] | Last push | Restates the value in one line with both options. The footer holds contact details, privacy policy and a link to todo.rw. Short. It must not compete with the form, which the VT audit flagged. |

**Deliberately removed:**
- a generic "Why choose us" grid
- a statistics band without sources
- a duplicate process strip
- a second hero-style statement in the footer
- long service descriptions

---

## 5. Three creative directions

### Direction A — "The Feed, Directed"
**Concept:** the page is the client's future feed. A visitor scrolls a TODO-curated social feed that, chapter by chapter, shows strategy, craft and results. It speaks the native language of someone who just tapped an Instagram ad.

**Visual identity and atmosphere:**
- Main-site paper and ink, with **Sun** yellow as the "attention" signal.
- Bricolage Grotesque at poster scale.
- Bold, warm, confident, close to todo.rw, so the brand stays consistent.

**Hero composition:**
- Huge H1 on the left, with "Impossible to Ignore" set in Sun.
- On the right, a slowly drifting **three-column wall of real posts and reels** (CSS transform, paused off-screen).
- On mobile, one vertical column of the wall sits under the H1 and CTA, cropped to 40 % of the screen.

**How work is shown:**
- Pieces sit in true platform ratios (4:5 posts, 9:16 reels) with honest captions.
- The case study opens as a "story" sequence of 5 tap-through frames: before, plan, shoot, launch, results.

**Motion and interaction:**
- Drifting wall in the hero.
- Tap-to-unmute reels.
- Story-style progress bars in the case study.
- Before/after drag slider.

**Mobile:** the best mobile fit of the three. Vertical media is native, story taps are a familiar gesture, and the sticky WhatsApp bar sits naturally.

**Strengths:**
- It matches the ad hook and placement.
- Fastest to build from the main-site tokens.
- Instantly shows "we make content".

**Weaknesses:**
- It depends heavily on having 12+ strong real pieces.
- It could drift toward looking like an Instagram clone if not art-directed.
- It is less distinctive than B.

### Direction B — "Impossible to Ignore" (Signal through Noise)
**Concept:** literalise the headline. The page opens on a muted, grey wall of indistinct look-alike content: the noise every business competes in. A single TODO piece cuts through in full colour. Scrolling reveals that clarity is engineered by Strategy → Create → Launch → Measure.

**Visual identity and atmosphere:**
- **Ink** night base (`#161838`) with desaturated noise.
- Real work is the *only* thing in full colour on the page. The design rule is "colour = proof".
- Sun is used as a single focus beam and on the primary CTA.
- Display type is very large and tightly set. Editorial and cinematic.

**Hero composition:**
- A full-bleed grid of blurred, monochrome placeholder tiles. These are abstract shapes, not fake posts.
- One real reel/photo in the centre is sharp and in colour, framed by a thin Sun focus ring.
- The H1 overlays the noise with the primary CTA under it.
- On load, the noise eases back about 600 ms after first paint. The CTA is never delayed.

**How work is shown:**
- In "The work" section, each piece "comes into focus" (desaturate → colour, blur → sharp) as it enters view.
- The **transformation is the centrepiece**: the before state lives in the grey world, and dragging the slider pulls it into colour.
- The connection diagram is a single Sun line that runs down the page and links artefacts stage by stage, ending at the form.

**Motion and interaction:**
- Focus-in reveals using CSS filter, cheap and in-view only.
- The Sun "signal line" draws along the scroll.
- Before/after drag slider.
- With reduced motion, everything renders in its final, in-focus state.

**Mobile:**
- The noise grid becomes 3 × 4 small tiles with the hero piece at 70 % width.
- The signal line runs down the left gutter.
- The form section switches to paper, for legibility and a calm finish.

**Strengths:**
- The most memorable and ownable idea. It *is* the headline, and it gives every future ad a visual language (grey → colour).
- It makes even a modest amount of real work look premium, because colour is rationed.
- It shares the dark-cinematic DNA of the VT page's strongest parts, so the four pages can feel like one family.

**Weaknesses:**
- Dark-dominant pages need care to stay warm and avoid feeling "tech".
- Filter animations must be tested on low-end Android and in-app browsers.
- It needs at least one genuine before/after to land fully.

### Direction C — "The Campaign Room"
**Concept:** take the visitor inside TODO's studio wall, where a campaign is planned, shot, launched and measured. It is an editorial, behind-the-scenes "making of" told through one real campaign from brief to result.

**Visual identity and atmosphere:**
- Paper base with pinned prints, contact sheets, grease-pencil marks in Pink and Teal, and ink annotations.
- Documentary and craft-led, with a magazine layout.

**Hero composition:**
- The H1 is set across a large contact sheet of a real shoot (e.g. Grotta frames).
- One frame is circled as "the selected shot", with the CTA beside it.
- On mobile, a horizontal strip of film frames sits beneath the H1.

**How work is shown:**
- The entire page is one campaign narrative: brief → mood → shoot → selects → posts → ad → results.
- Other work appears as a compact "more from the studio" gallery.

**Motion and interaction:**
- Hand-drawn annotations stroke in.
- Contact-sheet frames flip to the final edited post.
- A horizontal scrubbing film strip.

**Mobile:** works as a vertical story, though dense annotation must be simplified. Horizontal strips need clear scroll affordance.

**Strengths:**
- Shows process and craft very credibly.
- Distinctive.
- Great for explaining "how it connects".

**Weaknesses:**
- Built around **one fully documented campaign with verified results**, which does not exist yet.
- Longest page.
- The handwriting motif risks the "decorative notation noise" the VT audit warned against.
- Slower to the CTA.

### Comparison
| | A — Feed | B — Signal | C — Campaign Room |
|---|---|---|---|
| Memorability | Medium | **High** | High |
| Fit with ad hook | **High** | High | Medium |
| Works with limited proof | Low | **High** | Low |
| Mobile / in-app performance | **High** | Medium-high (test filters) | Medium |
| Build effort | Low | Medium | High |
| Family fit with the VT page | Medium | **High** | Medium |

---

## 6. Conversion strategy

| Stage | What the page does | Elements |
|---|---|---|
| **Attention** | Confirms the ad's promise in under 3 s and shows real work immediately | The H1 matches the ad. The hero visual is a real piece. The primary CTA is above the fold at 320 px. |
| **Interest** | Lets the work do the selling | "The work" sits second, with no explanation before it. Reels play muted when in view. |
| **Trust** | Proves the work moves numbers, not just looks good | Approved before/after, a verified case study, logos and testimonials. No numbers that cannot be sourced. |
| **Understanding** | Shows the system, not a list of services | Strategy → Create → Launch → Measure tied to real artefacts. "What's included" and "Who it's for" remove uncertainty. |
| **Enquiry** | Makes the next step small | A six-field form and a parallel WhatsApp route. Honest states. Clear contact expectations. |

**Element roles:**
- **Hero CTA, "Get a Marketing Proposal":** the single primary action, repeated only at natural decision points (after the case study and at the final CTA). The secondary "See the work" serves sceptical visitors and raises scroll depth, which is a possible ViewContent trigger.
- **Real marketing proof:** the core persuasion asset. Every piece is captioned and permission-tracked in config, with the review/production gating used on the VT page.
- **Service explanation:** answers "what do I actually get?" in plain groups. It keeps prices out unless approved.
- **Case studies:** convert interest into belief. They are also the retargeting destination (blueprint Phase 09).
- **Lead form:** the primary measured conversion (Meta `Lead` fires **only on confirmed successful submission**). It carries UTMs, fbclid, landing URL and `service=marketing`.
- **WhatsApp:** the low-friction route for mobile and in-app visitors, who often prefer chat. The click fires `Contact` (subject to consent). The prefilled message identifies the service and page so sales can attribute it. The source cannot be carried automatically, so add a short page reference to the message (e.g. "[MKT]") if sales agrees.
- **Final CTA:** the restated value plus both routes, for visitors who scrolled the whole page.

**Integration honesty:**
- No form backend for this page has been verified.
- The main site's EmailJS setup exists, but its delivery was not tested and it captures no source data.
- No Pixel ID, consent mechanism or privacy policy exists.

Until these are confirmed, the page should do what the VT page does: report honestly when online submission isn't connected, offer email/WhatsApp, and keep trackers off.

---

## 7. Unverified information requiring approval

| # | Item | Why it matters |
|---|---|---|
| 1 | **WhatsApp number**: `250794003368` vs `250799537999` | The primary mobile route. A wrong number loses leads. |
| 2 | **Lead inbox / routing**: `Richie@todo.rw` vs `info@todo.rw`, the owner, and the notification process | Blueprint Phase 05 requires an accountable owner |
| 3 | **Form backend**: reuse EmailJS, use the VT `submit.js` endpoint contract, or a CRM | Decides whether source data reaches sales |
| 4 | **Rights to Grotta photography and the campaign site**: who produced them, and approval for paid-ad landing pages | Currently the only substantial real work |
| 5 | **Which work TODO actually produced** (posts, reels, campaigns), plus client permission for each | "Lead with real work" |
| 6 | **Any campaign results**: source, date range, client sign-off | Blueprint: "numerical claims must be verified" |
| 7 | **SVF engagement**: may it be named or described publicly? | Contract is confidential by default |
| 8 | **Statistics and testimonials on the old `todo-html` site** (e.g. "Brands with structured product content generate 2× more repeat purchases", "Trusted by hospitality leaders", "Here's where [revenue] did [move]") | Unsourced. **Not to be reused.** |
| 9 | **Prices**: Starter $750 / Business $1,500 / "Monthly packages available" [S] | PDF itself says to validate them first |
| 10 | **Social profile URLs** for TODO Growth | Trust link and content source |
| 11 | **Process wording**: "Strategy → Create → Launch → Measure" [B] vs the site's "Strategy → Creativity → Technology → Execution → Growth" | The page uses the blueprint's version. Confirm it. |
| 12 | **Hosting/route**: `/marketing` on todo.rw (React app) or a static sibling like `virtual-tours` | Determines the build approach |
| 13 | **Meta Pixel ID, consent approach, privacy policy** | Required before tracking or ads |
| 14 | **Which blueprint PDF is final** (the two copies differ) | Source of truth |
| 15 | **Email required?** (sales policy) | Form configuration |

---

## 8. Recommended direction and reasoning

**Recommend: Direction B, "Impossible to Ignore" (Signal through Noise), with Direction A's mobile mechanics** (true-ratio vertical media, tap-to-unmute reels, sticky WhatsApp bar).

**Why:**
1. **It is the headline made visible.** The concept is the promise (stand out from the noise), so the page, the ads and the retargeting can share one recognisable visual language (grey → colour). That is what makes it memorable rather than another agency template.
2. **It is honest under thin proof.** Colour is rationed to real work, so a small, approved set of pieces looks curated and premium, not sparse. Directions A and C both collapse without a large or fully documented portfolio, which does not exist yet.
3. **It suits the blueprint's best proof format.** The before/after transformation becomes the centrepiece interaction, not an afterthought.
4. **It unifies the four-page family.** It continues the dark-cinematic language that the VT audit found strongest. It uses the main-site tokens (ink, paper, Sun, Bricolage/Schibsted), so it is clearly TODO. It avoids the VT page's two-systems problem by choosing *ink as the base and paper as the deliberate calm zone* (case study detail and form).
5. **It is technically achievable within the performance rules.** Focus reveals use CSS `filter` and `opacity`, are triggered by IntersectionObserver, are disabled under reduced motion, and get a static fallback if testing shows in-app jank.

**Technical recommendation:**
- Build it as a **static, dependency-free page in this folder**, reusing the VT page's proven modules: config gates, attribution, honest lead form, consent-gated tracking and review mode.
- This matches the sibling landing page, keeps in-app performance high and avoids touching the main React site.
- It can later be served at `/marketing` (decision §7.12).

---

## 9. Implementation roadmap

| Phase | Work | Output | Depends on |
|---|---|---|---|
| **Gate A: content intake** | Collect and approve real posts, reels, photos, the before/after and one case study, with written permissions. Resolve §7 items 1–6. | Asset manifest with a permission status per item | Business |
| **2. Content and copy** | Write final copy for all 11 sections from approved facts only. Define captions and the case-study text. | Copy deck for approval | Gate A |
| **3. Design system and prototype** | Ink/paper/Sun tokens, type scale, focus-reveal, signal line, slider and form states. Mobile first at 320/375/390. | Clickable static prototype with placeholder slots badged "pending" | Direction approval |
| **4. Build** | Static HTML/CSS/JS in this folder. `config.js` (contact, WhatsApp, form, tracking, the portfolio with permission flags), media pipeline (webp/avif, responsive sizes, MP4/H.264 with posters, lazy loading). | Working page in review mode | 2, 3 |
| **5. Lead capture and attribution** | Adapt `attribution.js`, `lead-form.js` and `submit.js` with `service=marketing`. Connect the chosen backend. Prefilled WhatsApp. | End-to-end test leads with source data | §7 items 1–3 |
| **6. Tracking and privacy** | Consent mechanism, privacy link, Pixel (PageView, ViewContent, Lead, Contact). CAPI evaluation with event-ID deduplication. | Events verified in Events Manager | §7 item 13 |
| **7. QA** | 320 px+, Android/iPhone, the Facebook and Instagram in-app browsers, slow 4G, reduced motion, keyboard/screen reader, Lighthouse. | QA log | 4–6 |
| **8. Launch gate** | Blueprint Phase 12 checklist, then deploy to `/marketing` | Live page | All |

The fallback if Gate A slips is to build and test everything with badged placeholders in review mode. **Do not launch paid traffic** until at least 6 approved work pieces and one approved before/after or case study exist. The blueprint requires proof, and the ad hook promises it.

---

## 10. Acceptance criteria

**Content and honesty**
- [ ] The H1 is exactly "Marketing That Makes Your Business Impossible to Ignore." The primary CTA is exactly "Get a Marketing Proposal".
- [ ] Every image, video, logo, testimonial and number in production has a recorded permission and source in config. Unapproved items are hidden in the production view.
- [ ] No AI-generated imagery is presented as TODO work. No unsourced statistic appears.
- [ ] All nine blueprint deliverables appear once, in "What's included".
- [ ] Strategy → Create → Launch → Measure is shown once, linked to real artefacts.

**Conversion**
- [ ] The H1, a real work piece and the primary CTA are visible without scrolling at 320 × 568 and 390 × 844.
- [ ] Real work appears before any explanatory section.
- [ ] The form has only the blueprint fields (plus optional sub-interest), validates inline, and has accessible success, error and not-connected states.
- [ ] Every lead carries `service`, landing URL, UTMs and fbclid where available, and is received by the confirmed owner (test lead evidence).
- [ ] The WhatsApp link opens with the prefilled marketing message on Android and iPhone, and only renders once the number is confirmed.
- [ ] `Lead` fires only after confirmed submission success. There are no duplicate events. Trackers stay off without consent.

**Performance and compatibility**
- [ ] Mobile LCP ≤ 2.5 s on simulated 4G. CLS < 0.1. Hero media ≤ 200 KB. Video lazy and muted with posters.
- [ ] No animation delays CTA access. `prefers-reduced-motion` shows static final states.
- [ ] Verified in the Facebook and Instagram in-app browsers, Safari iOS and Chrome Android.
- [ ] WCAG 2.2 AA: contrast (use the documented token pairs), focus states, labels and keyboard operation. The before/after slider is keyboard-operable.

**Launch**
- [ ] The blueprint Phase 12 master checklist is fully passed for this page.

---

## Recommendation

Approve **Direction B, "Impossible to Ignore"**, built as a static sibling to the Virtual Tours page. In parallel, start **Gate A**: the asset and permission intake, plus confirmation of the WhatsApp number, lead inbox and form backend. These are the real critical path. The design can be prototyped now, but the page cannot honestly launch without approved real work.

*Awaiting approval before any implementation.*
