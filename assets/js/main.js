/* ========= EVA — MAIN.JS (COMPLET) ========= */

/* Year */
document.querySelectorAll("#y, #year").forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* Reveal on scroll */
(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
})();

/* Skills bars on view */
(() => {
  const skillsBox = document.getElementById("skillsBox");
  if (!skillsBox) return;

  const obs2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        skillsBox.classList.add("on");
        obs2.disconnect();
      }
    });
  }, { threshold: 0.3 });

  obs2.observe(skillsBox);
})();

/* Typewriter titles */
(() => {
  function typeOnce(el) {
    const target = el.getAttribute("data-text") || "";
    const out = el.querySelector(".typeOut");
    const caret = el.querySelector(".caret");
    if (!out || el.dataset.typed === "1") return;

    el.dataset.typed = "1";
    out.textContent = "";
    let i = 0;
    const speed = 18;
    let last = performance.now();

    function step(now) {
      if (now - last < speed) { requestAnimationFrame(step); return; }
      last = now;
      out.textContent = target.slice(0, i++);
      if (i <= target.length) {
        requestAnimationFrame(step);
      } else {
        if (caret) caret.style.opacity = "0.0";
      }
    }
    requestAnimationFrame(step);
  }

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        typeOnce(e.target);
        titleObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".type-title").forEach(t => titleObserver.observe(t));
})();

/* Top nav horizontal scroll arrows (if present) */
(() => {
  const el = document.getElementById("topLinks");
  const left = document.getElementById("navLeft");
  const right = document.getElementById("navRight");
  if (!el || !left || !right) return;

  function refresh() {
    const overflow = el.scrollWidth > el.clientWidth + 2;
    left.style.display = overflow ? "inline-flex" : "none";
    right.style.display = overflow ? "inline-flex" : "none";
  }
  function scrollByX(dx) {
    el.scrollBy({ left: dx, behavior: "smooth" });
  }

  left.addEventListener("click", () => scrollByX(-220));
  right.addEventListener("click", () => scrollByX(220));
  window.addEventListener("resize", refresh);
  setTimeout(refresh, 80);
  refresh();
})();

/* Portfolio filter */
(() => {
  const segs = Array.from(document.querySelectorAll(".seg"));
  const shots = Array.from(document.querySelectorAll(".shot"));
  if (!segs.length || !shots.length) return;

  function setCat(cat) {
    segs.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
    shots.forEach(it => {
      it.style.display = (it.dataset.cat === cat) ? "" : "none";
    });
  }

  segs.forEach(btn => btn.addEventListener("click", () => setCat(btn.dataset.cat)));
  setCat("visuels");
})();

/* Lightbox (portfolio) */
(() => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbClose = document.getElementById("lbClose");
  const lbZoom = document.getElementById("lbZoom");
  const lbArea = document.getElementById("lbArea");
  const shots = Array.from(document.querySelectorAll(".shot"));

  if (!lb || !lbImg || !lbTitle || !lbClose || !lbZoom || !lbArea || !shots.length) return;

  function openLB(src, title) {
    lbTitle.textContent = title || "Aperçu";
    lbImg.src = src;
    lbImg.alt = title || "Aperçu";
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbArea.classList.remove("zoom");
    lbImg.style.transform = "scale(1)";
    lbZoom.textContent = "Zoom";
  }
  function closeLB() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
    lbArea.classList.remove("zoom");
    lbImg.style.transform = "scale(1)";
    lbZoom.textContent = "Zoom";
  }
  function toggleZoom() {
    const on = lbArea.classList.toggle("zoom");
    lbZoom.textContent = on ? "Adapter" : "Zoom";
    lbImg.style.transform = "scale(1)";
    z = 1;
  }

  lbClose.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });

  lbZoom.addEventListener("click", toggleZoom);
  lbArea.addEventListener("click", (e) => {
    if (e.target === lbImg || e.target === lbArea) toggleZoom();
  });

  let z = 1;
  lbArea.addEventListener("wheel", (e) => {
    if (!lbArea.classList.contains("zoom")) return;
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    z = Math.max(1, Math.min(3, z + (delta > 0 ? -0.12 : 0.12)));
    lbImg.style.transform = `scale(${z.toFixed(2)})`;
  }, { passive: false });

  shots.forEach(s => {
    s.addEventListener("click", () => {
      const src = s.getAttribute("data-src");
      const title = s.getAttribute("data-title");
      if (src) openLB(src, title);
    });
  });
})();

/* Choose pack -> fill contact input */
(() => {
  const packInput = document.getElementById("fPack");
  function goContactWithPack(packName) {
    if (packInput && packName) packInput.value = packName;
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("fEmail")?.focus(), 450);
  }
  document.querySelectorAll(".choosePack").forEach(btn => {
    btn.addEventListener("click", () => goContactWithPack(btn.getAttribute("data-pack") || ""));
  });
})();

/* Pack carousel arrows (mobile only) */
(() => {
  const track = document.getElementById("packsTrack");
  const prev = document.getElementById("packPrev");
  const next = document.getElementById("packNext");
  if (!track || !prev || !next) return;

  function isDesktop() {
    return window.matchMedia("(min-width: 980px)").matches;
  }

  function refresh() {
    if (isDesktop()) {
      prev.style.display = "none";
      next.style.display = "none";
      return;
    }
    const overflow = track.scrollWidth > track.clientWidth + 4;
    prev.style.display = overflow ? "inline-flex" : "none";
    next.style.display = overflow ? "inline-flex" : "none";
  }

  function scrollByCard(dir) {
    const card = track.querySelector(".packCard");
    const dx = (card ? card.getBoundingClientRect().width : 320) + 12;
    track.scrollBy({ left: dir * dx, behavior: "smooth" });
  }

  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));
  window.addEventListener("resize", () => setTimeout(refresh, 60));
  setTimeout(refresh, 80);
  refresh();
})();

/* Copy email button */
(() => {
  const EMAIL = "deabreue9@gmail.com";
  const copyMailBtn = document.getElementById("copyMailBtn");
  if (!copyMailBtn) return;

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return Promise.resolve();
  }

  copyMailBtn.addEventListener("click", async () => {
    await copyToClipboard(EMAIL);
    const old = copyMailBtn.textContent;
    copyMailBtn.textContent = "Copié ✅";
    setTimeout(() => copyMailBtn.textContent = old || "Copier mon email", 1200);
  });
})();

/* Formsubmit UX */
(() => {
  const quoteForm = document.getElementById("quoteForm");
  const successBox = document.getElementById("successBox");
  const sendBtn = document.getElementById("sendBtn");
  if (!quoteForm || !successBox || !sendBtn) return;

  quoteForm.addEventListener("submit", () => {
    sendBtn.textContent = "Envoi...";
    successBox.classList.add("on");
  });
})();

/* Instagram link */
(() => {
  const IG_URL = "https://www.instagram.com/edbra_nd/";
  const igBtn = document.getElementById("igBtn");
  if (!igBtn) return;

  if (IG_URL && IG_URL.startsWith("http")) {
    igBtn.href = IG_URL;
    igBtn.target = "_blank";
    igBtn.rel = "noopener";
    igBtn.textContent = "Instagram";
    igBtn.removeAttribute("aria-disabled");
    igBtn.removeAttribute("title");
  }
})();

/* ========= AVIS (INDEX) — CARROUSEL STYLÉ ========= */
(function initReviews(){
  const track = document.getElementById("reviewsTrack");
  const dots = document.getElementById("revDots");
  const prev = document.getElementById("revPrev");
  const next = document.getElementById("revNext");
  const wrap = track?.closest(".reviews");
  const prog = document.getElementById("revProg");

  if(!track || !dots || !prev || !next) return;

const reviews = [
  { name:"Dorian", stars:5, meta:"Avis Google • il y a 18 heures", text:"Je recommande grandement ses services ! Très professionnel et réactive. Visité en février." },
  { name:"Sheylie Berkane", stars:5, meta:"Avis Google • il y a 23 heures", text:"Je recommande vivement pour ses services et sa réactivité c’était un grand plaisir d’obtenir son aide ! Visité en février." },
  { name:"Sandiyya", stars:5, meta:"Avis Google • il y a 23 heures", text:"Je recommande sans hésiter ses services ! Visité en janvier." },

  { name:"Patrick Mat", stars:5, meta:"Avis Google • il y a 14 heures • Nouveau", text:"Personne agréable, très professionnelle, toujours a l'écoute. Un travail au top je recommande a 1000% ! Visité en février." },
  { name:"Sylvie Materne", stars:5, meta:"Avis Google • il y a 15 heures • Nouveau", text:"Travail impeccable, personne agréable et sérieuse. Je recommande son professionnalisme ! Je suis ravie. Merci beaucoup. Visité en février." }
];

  function starsStr(n){
    const x = Math.max(0, Math.min(5, n));
    return "★".repeat(x) + "☆".repeat(5 - x);
  }

  track.innerHTML = reviews.map(r => `
    <div class="review" role="group" aria-label="Avis client">
      <div class="revTop">
        <div>
          <div class="revName">${r.name}</div>
          <div class="revMeta">${r.meta || ""}</div>
        </div>
        <div class="revStars" aria-label="${r.stars} sur 5">
          <span class="stars">${starsStr(r.stars)}</span>
          <span class="starsPulse" aria-hidden="true"></span>
        </div>
      </div>
      <div class="revText">${r.text}</div>
      <div class="revQuote" aria-hidden="true">“</div>
    </div>
  `).join("");

  const mq = window.matchMedia("(min-width: 980px)");
  let idx = 0;
  let timer = null;
  let startAt = 0;
  const DURATION = 5200;

  function perView(){ return mq.matches ? 2 : 1; }
  function pages(){ return Math.max(1, Math.ceil(reviews.length / perView())); }

  function buildDots(){
    const p = pages();
    dots.innerHTML = "";
    for(let i=0;i<p;i++){
      const d = document.createElement("div");
      d.className = "revDot" + (i===idx ? " on" : "");
      d.addEventListener("click", () => go(i, true));
      dots.appendChild(d);
    }
    const showNav = p > 1;
    prev.style.display = showNav ? "inline-flex" : "none";
    next.style.display = showNav ? "inline-flex" : "none";
    dots.style.display = showNav ? "flex" : "none";
    if(prog) prog.style.width = "0%";
  }

  function updateDots(){
    Array.from(dots.children).forEach((d,i)=> d.classList.toggle("on", i===idx));
  }

  function clampIdx(){
    const p = pages();
    if(idx < 0) idx = p - 1;
    if(idx > p - 1) idx = 0;
  }

  function scrollToIdx(smooth){
    const left = track.clientWidth * idx;
    track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }

  function go(n, smooth){
    idx = n;
    clampIdx();
    scrollToIdx(smooth);
    updateDots();
    restart();
  }

  function nextOne(){ go(idx + 1, true); }
  function prevOne(){ go(idx - 1, true); }

  prev.addEventListener("click", prevOne);
  next.addEventListener("click", nextOne);

  function tick(now){
    if(!timer) return;
    const elapsed = now - startAt;
    const t = Math.min(1, elapsed / DURATION);
    if(prog) prog.style.width = `${Math.round(t*100)}%`;
    if(t >= 1){
      nextOne();
      return;
    }
    requestAnimationFrame(tick);
  }

  function start(){
    stop();
    if(pages() <= 1) return;
    timer = { on:true };
    startAt = performance.now();
    requestAnimationFrame(tick);
  }

  function stop(){
    timer = null;
    if(prog) prog.style.width = "0%";
  }

  function restart(){
    start();
  }

  wrap?.addEventListener("mouseenter", stop);
  wrap?.addEventListener("mouseleave", start);
  wrap?.addEventListener("focusin", stop);
  wrap?.addEventListener("focusout", start);

  // Swipe
  let touchX = null;
  track.addEventListener("touchstart", (e)=>{ touchX = e.touches?.[0]?.clientX ?? null; }, {passive:true});
  track.addEventListener("touchend", (e)=>{
    if(touchX == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchX;
    const dx = endX - touchX;
    touchX = null;
    if(Math.abs(dx) > 40){
      dx < 0 ? nextOne() : prevOne();
    }
  }, {passive:true});

  function onResize(){
    const p = pages();
    if(idx > p - 1) idx = p - 1;
    buildDots();
    scrollToIdx(false);
    updateDots();
    start();
  }

  mq.addEventListener?.("change", onResize);
  window.addEventListener("resize", () => {
    clearTimeout(window.__revResize);
    window.__revResize = setTimeout(onResize, 120);
  });

  buildDots();
  scrollToIdx(false);
  start();
})();
/* ===== MENU MOBILE (burger) ===== */
(() => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("mobileClose");
  if(!burger || !menu || !closeBtn) return;

  function openMenu(){
    menu.classList.add("open");
    menu.setAttribute("aria-hidden","false");
    burger.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(){
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden","true");
    burger.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener("click", closeMenu);

  // clique sur le fond = fermer
  menu.addEventListener("click", (e) => { if(e.target === menu) closeMenu(); });

  // lien du menu = fermer après clic
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeMenu());
  });

  // ESC = fermer
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeMenu();
  });
})();
