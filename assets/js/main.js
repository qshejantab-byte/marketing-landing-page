/**
 * Marketing page bootstrap. Everything here is progressive enhancement:
 * the page is complete and readable without JavaScript, and every effect
 * has a reduced-motion state that shows its final frame.
 */
import { CONFIG, REVIEW_MODE, waLink } from "./config.js";
import { mountLeadForm } from "./lead-form.js";

const root = document.documentElement;
const MOTION = !matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
root.classList.add("js");
if (MOTION) root.classList.add("motion");

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (v, a, b) => clamp((v - a) / (b - a));
const isSmall = () => innerWidth < 700;

function el(tag, attrs = {}, text) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
}

/* ── WhatsApp: one confirmed number, one prefilled message ─────────────── */
for (const a of $$("[data-wa]")) a.href = waLink();

/* ── NOISE: walls of look-alike posts (decorative) ─────────────────────── */
const CLICHES = [
  "New post", "Don't miss out!", "Link in bio", "Big sale this weekend", "Tag a friend", "Happy Monday",
  "We're open!", "Coming soon", "Best in town", "Throwback Thursday", "Swipe up", "Limited offer",
  "Thank you for 1k", "Weekend vibes", "Book now", "Our new menu", "Like & share", "Stay tuned",
];
const COLOURS = ["#ffc83d", "#f2478b", "#3d9ef0", "#14b592", "#ff7a2e", "#5b3fe0"];

function noiseColumn(tiles, seed, colour) {
  const col = el("div", { class: "nz-col" });
  col.style.setProperty("--dur", `${55 + ((seed * 17) % 45)}s`);
  col.style.setProperty("--dir", seed % 2 ? "reverse" : "normal");
  col.style.marginTop = `${-((seed * 53) % 160)}px`;
  const pattern = [];
  for (let t = 0; t < tiles; t++) pattern.push({ tall: (seed + t) % 3 === 0, cap: CLICHES[(seed * 5 + t * 7) % CLICHES.length] });
  for (const p of [...pattern, ...pattern]) {
    const tile = el("div", { class: "nz-tile" + (p.tall ? " is-tall" : "") });
    if (colour) tile.style.setProperty("--tc", COLOURS[(seed + p.cap.length) % COLOURS.length]);
    tile.append(el("b"), el("i"), el("u", {}, p.cap));
    col.appendChild(tile);
  }
  return col;
}

function buildNoise(host) {
  const colour = host.hasAttribute("data-noise-colour");
  const baseCols = Number(host.dataset.noiseCols) || 7;
  const cols = isSmall() ? Math.max(3, Math.ceil(baseCols / 2)) : baseCols;
  const layers = host.matches(".hero-noise") ? [1, 2, 3] : [0];
  const frag = document.createDocumentFragment();
  layers.forEach((depth, li) => {
    const layer = el("div", { class: "nz-layer", "data-depth": String(depth) });
    layer.style.setProperty("--d", String(depth));
    const n = depth === 1 ? cols + 3 : depth === 3 ? Math.max(3, cols - 3) : cols;
    for (let c = 0; c < n; c++) layer.appendChild(noiseColumn(5, c * 3 + li * 7 + 1, colour));
    frag.appendChild(layer);
  });
  host.replaceChildren(frag);
}
$$("[data-noise]").forEach(buildNoise);

/* Pause decorative loops while off-screen. */
const pauser = new IntersectionObserver((entries) => {
  for (const e of entries) e.target.classList.toggle("is-paused", !e.isIntersecting);
});
$$(".hero, .shift-stage, .close").forEach((s) => pauser.observe(s));

/* ── HERO: split words for the opening sequence ────────────────────────── */
for (const node of $$("[data-words]")) {
  const words = node.textContent.trim().split(/\s+/);
  node.replaceChildren(
    ...words.flatMap((w, i) => {
      const s = el("span", { class: "w" }, w);
      s.style.setProperty("--i", String(i));
      return i < words.length - 1 ? [s, document.createTextNode(" ")] : [s];
    }),
  );
}

/* ── HERO: the feed that stops on the one post worth stopping for ──────── */
const FEED_POSTS = [
  ["sunset.lodge", "New post ✨"], ["citycafe", "Happy Monday everyone"], ["kigali.deals", "Big sale this weekend!!"],
  ["bestrealty", "Link in bio"], ["the.grill", "Don't miss out"], ["urbanstay", "Throwback 🙌"],
  ["tour.co", "Tag a friend who needs this"], null, ["lakeview", "We're open!"], ["shop.rw", "Limited offer"],
  ["green.hotel", "Coming soon"], ["mybrand", "Like & share"], ["citycafe", "Weekend vibes"], ["kigali.deals", "Book now"],
];

function mountFeed() {
  const stage = $("[data-stage]");
  const feed = $("[data-feed]");
  if (!stage || !feed) return;
  const track = el("div", { class: "feed-track" });
  const make = (p) => {
    const post = el("div", { class: "fp" + (p ? "" : " is-hero") });
    post.append(el("b", {}, p ? p[0] : "your.business"), el("i"), el("u", {}, p ? p[1] : "The post people actually stop for."));
    return post;
  };
  for (let r = 0; r < 2; r++) FEED_POSTS.forEach((p) => track.appendChild(make(p)));
  feed.replaceChildren(track);

  const counter = $("[data-scrolled]", stage);
  const heroes = $$(".fp.is-hero", track);
  let half = 0;
  let pitch = 0;
  const measure = () => {
    half = track.scrollHeight / 2;
    pitch = half / FEED_POSTS.length;
  };
  measure();
  addEventListener("resize", measure, { passive: true });

  const stopTarget = (from) => {
    const screenH = feed.clientHeight;
    const centres = heroes.map((h) => h.offsetTop + h.offsetHeight / 2 - screenH / 2);
    const ahead = centres.map((c) => (c < from + 60 ? c + half : c));
    return Math.min(...ahead);
  };

  if (!MOTION) {
    const y = stopTarget(0);
    track.style.transform = `translateY(${-y}px)`;
    counter.textContent = String(Math.round(y / pitch));
    stage.classList.add("is-stopped");
    return;
  }

  // Start four posts above the one that stops the scroll, so the first
  // breakthrough lands about three seconds after the page opens.
  let y = Math.max(0, stopTarget(0) - pitch * 4); // position inside the loop
  let travelled = 0; // total distance, for the counter
  let v = 0;
  let mode = "cruise";
  let modeAt = performance.now();
  let cruiseFor = 1500; // first pass is short; later passes cruise longer
  let target = null;
  let last = performance.now();
  let visible = true;
  const VMAX = 420; // a natural thumb-flick speed

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) {
      last = performance.now();
      requestAnimationFrame(tick);
    }
  }).observe(stage);

  function tick(now) {
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (mode === "cruise") {
      v += (VMAX - v) * Math.min(1, dt * 2.5);
      if (now - modeAt > cruiseFor) {
        mode = "brake";
        target = stopTarget(y + 160);
        cruiseFor = 3200;
      }
    } else if (mode === "brake") {
      const dist = target - y;
      v = Math.max(36, Math.min(VMAX, dist * 3));
      if (dist <= 0.8) {
        y = target;
        v = 0;
        mode = "hold";
        modeAt = now;
        stage.classList.add("is-stopped");
      }
    } else if (mode === "hold" && now - modeAt > 3400) {
      mode = "cruise";
      modeAt = now;
      stage.classList.remove("is-stopped");
    }
    const step = v * dt;
    y += step;
    travelled += step;
    if (y >= half) {
      y -= half;
      if (target != null) target -= half;
    }
    track.style.transform = `translate3d(0, ${-y.toFixed(1)}px, 0)`;
    counter.textContent = String(Math.floor(travelled / pitch));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
mountFeed();

/* ── HERO: pointer depth (noise parallax + phone tilt) ─────────────────── */
function mountDepth() {
  const hero = $("[data-hero]");
  const tilt = $("[data-tilt]");
  if (!hero || !MOTION || !FINE) return;
  let raf = 0;
  hero.addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const px = (e.clientX / innerWidth) * 2 - 1;
      const py = (e.clientY / innerHeight) * 2 - 1;
      hero.style.setProperty("--px", px.toFixed(3));
      hero.style.setProperty("--py", py.toFixed(3));
      if (tilt) {
        tilt.style.setProperty("--tx", (px * 9).toFixed(2));
        tilt.style.setProperty("--ty", (-py * 7).toFixed(2));
      }
    });
  });
  hero.addEventListener("pointerleave", () => {
    tilt?.style.setProperty("--tx", "0");
    tilt?.style.setProperty("--ty", "0");
  });
}
mountDepth();

/* ── Reveals: tune-in and wipes ────────────────────────────────────────── */
function mountReveals() {
  const els = $$("[data-tune], [data-wipe]");
  if (!MOTION) return els.forEach((n) => n.classList.add("is-in"));
  // A fully clipped element never intersects, so wipes are observed
  // through their parent and revealed from there.
  const targetOf = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (targetOf.get(e.target) || [e.target]).forEach((n) => n.classList.add("is-in"));
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );
  for (const n of els) {
    const watch = n.hasAttribute("data-wipe") ? n.parentElement : n;
    targetOf.set(watch, [...(targetOf.get(watch) || []), n]);
    io.observe(watch);
  }
}

/* ── Scroll-driven: the shift, masthead progress, hero parallax ────────── */
function mountScroll() {
  const shift = $("[data-shift]");
  const hero = $("[data-hero]");
  const mast = $("[data-masthead]");
  let ticking = false;

  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    mast.style.setProperty("--progress", (max > 0 ? scrollY / max : 0).toFixed(4));
    if (!MOTION) return;
    if (hero && scrollY < innerHeight * 1.2) hero.style.setProperty("--scrollY", `${scrollY}px`);
    if (shift) {
      const r = shift.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 1;
      shift.style.setProperty("--open", range(p, 0.12, 0.55).toFixed(4));
      shift.style.setProperty("--text", range(p, 0.42, 0.78).toFixed(4));
      shift.style.setProperty("--o2", range(p, 0.75, 0.92).toFixed(4));
    }
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  if (MOTION && shift) {
    shift.style.setProperty("--open", "0");
    shift.style.setProperty("--text", "0");
    shift.style.setProperty("--o2", "0");
  }
  update();
}

/* ── The scope: noise resolving into a clean line, stage by stage ──────── */
const STAGE_COPY = [
  { label: "Strategy", caption: "Direction before decoration.", color: "#ffc83d" },
  { label: "Create", caption: "A voice people recognise.", color: "#f2478b" },
  { label: "Launch", caption: "Reach the right people, consistently.", color: "#3d9ef0" },
  { label: "Measure", caption: "Enquiries you can trace, and grow.", color: "#14b592" },
];

function wavePath(t, chaos) {
  const N = 96;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const clean = Math.sin(u * Math.PI * 3 + t * 1.1) * 26 * (1 - u * 0.5) - Math.pow(u, 5) * 74;
    const noise = Math.sin(i * 1.7 + t * 9) * 34 + Math.sin(u * 47 - t * 6) * 22 + Math.sin(i * 0.37 + t * 13) * 18;
    d += (i ? " L" : "M") + (u * 600).toFixed(1) + " " + (100 + clean * (1 - chaos) + noise * chaos).toFixed(1);
  }
  return d;
}

function mountScope() {
  const scope = $("[data-signal]");
  const stages = $$("[data-stage-i]");
  if (!scope || !stages.length) return;
  const live = $("[data-wave]", scope);
  const ghost = $("[data-wave-ghost]", scope);
  const label = $("[data-signal-label]", scope);
  const caption = $("[data-signal-caption]", scope);
  const num = $("[data-signal-num]", scope);
  const dots = $$("[data-step-dot]", scope);
  let active = -1;
  let chaos = 1;
  let target = 0.85;
  let visible = false;
  let raf = 0;

  ghost.setAttribute("d", wavePath(0.3, 1));

  function setActive(i) {
    if (i === active) return;
    active = i;
    const s = STAGE_COPY[i];
    scope.style.setProperty("--sc", s.color);
    label.textContent = s.label;
    caption.textContent = s.caption;
    num.textContent = String(i + 1).padStart(2, "0");
    dots.forEach((d, n) => d.classList.toggle("is-on", n <= i));
    stages.forEach((st, n) => st.classList.toggle("is-on", n === i));
    target = [0.85, 0.5, 0.22, 0][i];
    if (!MOTION) live.setAttribute("d", wavePath(0, target));
  }
  const frame = (ts) => {
    chaos += (target - chaos) * 0.05;
    live.setAttribute("d", wavePath(ts / 1000, chaos));
    raf = visible ? requestAnimationFrame(frame) : 0;
  };
  const sio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.stageI));
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  stages.forEach((s) => sio.observe(s));
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && getComputedStyle(scope).display !== "none";
    if (visible && MOTION && !raf) raf = requestAnimationFrame(frame);
  }).observe(scope.closest("section"));
  setActive(0);
}

/* ── The screening room ────────────────────────────────────────────────── */
function fillApprovedWork(wall) {
  const approved = CONFIG.work.filter((w) => w.permission === "approved");
  if (!approved.length) return;
  const slots = $$(".slot", wall);
  approved.forEach((item, i) => {
    let slot = slots[i];
    if (!slot) {
      slot = slots[i % slots.length].cloneNode(true);
      wall.appendChild(slot);
    }
    slot.dataset.kind = item.type === "reel" ? "reel" : item.type || "post";
    slot.classList.add("is-real");
    const media = $(".slot-media", slot);
    media.replaceChildren();
    if (item.type === "reel" && item.video) {
      const v = el("video", { poster: item.src, loop: "", playsinline: "", preload: "none", "aria-label": item.alt });
      v.muted = true;
      v.appendChild(el("source", { src: item.video, type: "video/mp4" }));
      media.appendChild(v);
    } else {
      media.appendChild(
        el("img", { src: item.src, srcset: item.srcset, sizes: "(max-width: 1023px) 72vw, 24rem", alt: item.alt, loading: "lazy", decoding: "async" }),
      );
    }
    $(".slot-kind", slot).textContent = item.format || item.type;
    $(".slot-client", slot).textContent = item.client;
    $(".slot-what", slot).textContent = item.title;
  });
  $$(".slot:not(.is-real)", wall).forEach((s) => s.remove());
  $$(".slot-n", wall).forEach((n, i) => (n.textContent = String(i + 1).padStart(2, "0")));
  const lead = $("[data-work-lead]");
  if (lead) lead.textContent = "Every piece shown the way it ran: the format, who it was for and what it was made to do.";
}

function wireVideo(media) {
  const v = $("video", media);
  if (!v) return;
  const sound = el("button", { type: "button", class: "reel-sound", "aria-pressed": "false" }, "Sound on");
  sound.addEventListener("click", (e) => {
    e.stopPropagation();
    v.muted = !v.muted;
    sound.setAttribute("aria-pressed", String(!v.muted));
    sound.textContent = v.muted ? "Sound on" : "Sound off";
    if (v.paused) v.play().catch(() => {});
  });
  media.appendChild(sound);
  if (!MOTION) return; // reduced motion: tap to play only
  new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.6 }).observe(v);
}

function mountScreening() {
  const section = $("#work");
  const wall = $("[data-work-wall]");
  if (!wall) return;
  fillApprovedWork(wall);
  const slots = $$(".slot", wall);
  const frame = $("[data-screen-frame]");
  const kind = $("[data-screen-kind]");
  const title = $("[data-screen-title]");
  const what = $("[data-screen-what]");
  const rail = $("[data-work-rail]");
  const bars = $("[data-story-bars]");
  const desktop = matchMedia("(min-width: 1024px)");

  function select(i) {
    const slot = slots[i];
    slots.forEach((s, n) => $(".slot-btn", s).setAttribute("aria-pressed", String(n === i)));
    section.style.setProperty("--active-c", slot.style.getPropertyValue("--c"));
    const media = $(".slot-media", slot).cloneNode(true);
    frame.classList.toggle("is-wide", slot.dataset.kind !== "reel");
    frame.replaceChildren(media);
    wireVideo(media);
    kind.textContent = $(".slot-kind", slot).textContent;
    title.textContent = $(".slot-client", slot).textContent;
    what.textContent = $(".slot-what", slot).textContent;
  }

  slots.forEach((slot, i) => {
    const btn = $(".slot-btn", slot);
    btn.addEventListener("click", () => {
      if (desktop.matches) select(i);
      else slot.scrollIntoView({ behavior: MOTION ? "smooth" : "auto", inline: "start", block: "nearest" });
    });
    if (FINE) btn.addEventListener("mouseenter", () => desktop.matches && select(i));
    if (!desktop.matches) wireVideo($(".slot-media", slot));
  });
  select(0);

  // story bars for the swipe rail
  bars.replaceChildren(...slots.map(() => el("span")));
  const barEls = $$("span", bars);
  let ticking = false;
  const syncBars = () => {
    ticking = false;
    const step = slots[1] ? slots[1].offsetLeft - slots[0].offsetLeft : 1;
    const p = rail.scrollLeft / step;
    barEls.forEach((b, i) => b.style.setProperty("--f", clamp(p + 1 - i).toFixed(3)));
  };
  rail.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncBars);
      }
    },
    { passive: true },
  );
  syncBars();
}

/* ── Case study (production: only when approved) ───────────────────────── */
function mountCase() {
  const section = $("[data-case]");
  if (!section) return;
  const cs = CONFIG.caseStudy && CONFIG.caseStudy.permission === "approved" ? CONFIG.caseStudy : null;
  if (!cs && !REVIEW_MODE) return;
  section.hidden = false;

  if (cs) {
    $("[data-case-title]", section).textContent = cs.headline || cs.client;
    $("[data-case-client]", section).textContent = [cs.client, cs.sector].filter(Boolean).join(" · ");
    for (const f of ["context", "challenge", "approach"]) {
      const p = $(`[data-case-field="${f}"]`, section);
      if (cs[f]) p.textContent = cs[f];
    }
    if (cs.creative?.length) {
      $("[data-case-creative]", section).replaceChildren(...cs.creative.map((c) => el("img", { src: c.src, alt: c.alt, loading: "lazy" })));
    }
    if (cs.results?.length) {
      $("[data-case-results]", section).replaceChildren(
        ...cs.results.map((r) => {
          const li = el("li");
          li.append(el("strong", {}, `${r.value} `), document.createTextNode(`${r.label} `), el("small", {}, `(${r.source})`));
          return li;
        }),
      );
    }
    const put = (pane, img) => pane.replaceChildren(el("img", { src: img.src, alt: img.alt, loading: "lazy" }), $(".compare-tag", pane));
    if (cs.before && cs.after) {
      put($("[data-compare-before]", section), cs.before);
      put($("[data-compare-after]", section), cs.after);
      $("[data-compare-ph]", section)?.remove();
    }
  }

  const compare = $("[data-compare]", section);
  const input = $("[data-compare-range]", section);
  const sync = () => {
    compare.style.setProperty("--pos", `${input.value}%`);
    input.setAttribute("aria-valuetext", `${input.value}% before, ${100 - input.value}% after`);
  };
  input.addEventListener("input", sync);
  sync();
}

/* ── Close: a spotlight that pulls colour out of the noise ─────────────── */
function mountSpotlight() {
  const close = $("[data-spotlight]");
  if (!close || !MOTION) return;
  if (!FINE) {
    close.classList.add("is-idle");
    return;
  }
  close.classList.add("is-idle");
  close.addEventListener("pointermove", (e) => {
    const r = close.getBoundingClientRect();
    close.classList.remove("is-idle");
    close.style.setProperty("--sx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    close.style.setProperty("--sy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  });
  close.addEventListener("pointerleave", () => close.classList.add("is-idle"));
}

/* ── Magnetic primary buttons (fine pointers only) ─────────────────────── */
function mountMagnetic() {
  if (!MOTION || !FINE) return;
  for (const b of $$("[data-magnetic]")) {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px`);
      b.style.setProperty("--my", `${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px`);
    });
    b.addEventListener("pointerleave", () => {
      b.style.setProperty("--mx", "0px");
      b.style.setProperty("--my", "0px");
    });
  }
}

/* ── Masthead: current section ─────────────────────────────────────────── */
function mountNavCurrent() {
  const links = $$(".masthead-nav a");
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const a = map.get(e.target.id);
        if (a) a.toggleAttribute("aria-current", e.isIntersecting);
        if (a && e.isIntersecting) a.setAttribute("aria-current", "true");
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  map.forEach((_, id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

/* ── Brief meter ───────────────────────────────────────────────────────── */
function mountMeter() {
  const form = $("[data-lead-form]");
  const fill = $("[data-meter-fill]");
  const count = $("[data-meter-count]");
  if (!form || !fill) return;
  const update = () => {
    const f = form.elements;
    const done = [
      f.name.value.trim().length >= 2,
      f.business.value.trim().length >= 2,
      f.phone.value.replace(/\D/g, "").length >= 9,
      $$('input[name="needs"]:checked', form).length > 0,
      f.brief.value.trim().length >= CONFIG.form.briefMin,
    ].filter(Boolean).length;
    fill.style.setProperty("--m", String(done / 5));
    count.textContent = `${done} of 5`;
  };
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
}

/* ── Mobile dock: after the hero, out of the way at the form ───────────── */
function mountDock() {
  const dock = $("[data-dock]");
  const hero = $("[data-hero]");
  const proposal = $("[data-proposal]");
  if (!dock || !hero) return;
  dock.hidden = false;
  let pastHero = false;
  let atForm = false;
  const update = () => {
    const on = pastHero && !atForm;
    dock.classList.toggle("is-on", on);
    dock.inert = !on;
  };
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    update();
  }).observe(hero);
  new IntersectionObserver(
    ([e]) => {
      atForm = e.isIntersecting;
      update();
    },
    { rootMargin: "0px 0px -25% 0px" },
  ).observe(proposal);
  update();
}

/* ── Review bar: what is still missing (never shown in production) ────── */
function mountReviewBar() {
  if (!REVIEW_MODE) return;
  const bar = $("[data-review-bar]");
  const items = [];
  if (!CONFIG.work.some((w) => w.permission === "approved")) items.push("Work: six placeholders. Waiting for approved media from the media team.");
  if (!CONFIG.caseStudy) items.push("Case study: placeholder layout, hidden in production until approved.");
  items.push("EmailJS: Outlook connection returned 412 (invalid grant). Reconnect it, then test delivery to Richie@todo.rw.");
  items.push("No privacy policy page exists yet.");
  const det = el("details");
  det.append(el("summary", {}, `Review mode · ${items.length} items before launch`));
  const ul = el("ul");
  items.forEach((t) => ul.appendChild(el("li", {}, t)));
  det.appendChild(ul);
  bar.replaceChildren(det);
  bar.hidden = false;
}

/* ── boot ──────────────────────────────────────────────────────────────── */
mountScreening();
mountCase();
mountReveals();
mountScroll();
mountScope();
mountSpotlight();
mountMagnetic();
mountNavCurrent();
mountMeter();
mountDock();
mountReviewBar();
mountLeadForm($("[data-proposal]"));
const year = $("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
