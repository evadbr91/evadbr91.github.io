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

/* ===== MENU MOBILE (burger) ===== */
document.addEventListener("DOMContentLoaded", () => {
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

  burger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });

  menu.addEventListener("click", (e) => { if(e.target === menu) closeMenu(); });

  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeMenu());
  });

  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeMenu();
  });
});

/* ========= AVIS (CARROUSEL MOBILE SAFE: TRANSFORM) ========= */
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
    { name:"Sandiyya", stars:5, meta:"Avis Google • il y a 23 heures", text:"Je recommande sans hésiter ses services ! Visité en janvier." }
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
  let raf = null;
  let startAt = 0;
  const DURATION = 5200;

  function perView(){ return mq.matches ? 2 : 1; }
  function pages(){ return Math.max(1, Math.ceil(reviews.length / perView())); }

  function slideWidth(){
    const first = track.querySelector(".review");
    if(!first) return 0;
    return first.getBoundingClientRect().width;
  }
  function gap(){ return 12; } // must match CSS gap

  function applyTransform(smooth){
    track.style.transition = smooth ? "transform .55s cubic-bezier(.2,.9,.2,1)" : "none";
    const x = idx * (slideWidth() + gap());
    track.style.transform = `translate3d(${-x}px,0,0)`;
    if(!smooth) requestAnimationFrame(()=> track.style.transition = "transform .55s cubic-bezier(.2,.9,.2,1)");
  }

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

  function go(n, smooth){
    idx = n;
    clampIdx();
    applyTransform(smooth);
    updateDots();
    restart();
  }
  function nextOne(){ go(idx + 1, true); }
  function prevOne(){ go(idx - 1, true); }

  prev.addEventListener("click", prevOne);
  next.addEventListener("click", nextOne);

  function tick(now){
    if(!raf) return;
    const elapsed = now - startAt;
    const t = Math.min(1, elapsed / DURATION);
    if(prog) prog.style.width = `${Math.round(t*100)}%`;
    if(t >= 1){
      nextOne();
      return;
    }
    raf = requestAnimationFrame(tick);
  }
  function start(){
    stop();
    if(pages() <= 1) return;
    startAt = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop(){
    if(raf){ cancelAnimationFrame(raf); raf = null; }
    if(prog) prog.style.width = "0%";
  }
  function restart(){ start(); }

  wrap?.addEventListener("mouseenter", stop);
  wrap?.addEventListener("mouseleave", start);
  wrap?.addEventListener("focusin", stop);
  wrap?.addEventListener("focusout", start);

  // Swipe (mobile)
  let touchX = null;
  wrap?.addEventListener("touchstart", (e)=>{ touchX = e.touches?.[0]?.clientX ?? null; }, {passive:true});
  wrap?.addEventListener("touchend", (e)=>{
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
    applyTransform(false);
    updateDots();
    start();
  }

  mq.addEventListener?.("change", onResize);
  window.addEventListener("resize", () => {
    clearTimeout(window.__revResize);
    window.__revResize = setTimeout(onResize, 120);
  });

  buildDots();
  applyTransform(false);
  start();
})();
