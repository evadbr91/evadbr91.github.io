(function(){
  // Year
  const year = document.getElementById("y");
  if(year) year.textContent = new Date().getFullYear();

  // Active nav (based on file)
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".links a, .mobileLinks a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if(href === current) a.classList.add("active");
  });

  // Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("on");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Type titles
  function typeOnce(el){
    const target = el.getAttribute("data-text") || "";
    const out = el.querySelector(".typeOut");
    const caret = el.querySelector(".caret");
    if(!out || el.dataset.typed === "1") return;

    el.dataset.typed = "1";
    out.textContent = "";
    let i = 0;
    const speed = 18;
    let last = performance.now();

    function step(now){
      if(now - last < speed){ requestAnimationFrame(step); return; }
      last = now;
      out.textContent = target.slice(0, i++);
      if(i <= target.length){
        requestAnimationFrame(step);
      }else{
        if(caret) caret.style.opacity = "0.0";
      }
    }
    requestAnimationFrame(step);
  }
  const titleObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        typeOnce(e.target);
        titleObserver.unobserve(e.target);
      }
    });
  }, {threshold: 0.3});
  document.querySelectorAll(".type-title").forEach(t => titleObserver.observe(t));

  // Horizontal nav arrows (desktop / tablets)
  (function(){
    const el = document.getElementById("topLinks");
    const left = document.getElementById("navLeft");
    const right = document.getElementById("navRight");
    if(!el || !left || !right) return;

    function refresh(){
      const overflow = el.scrollWidth > el.clientWidth + 2;
      left.style.display = overflow ? "inline-flex" : "none";
      right.style.display = overflow ? "inline-flex" : "none";
    }
    function scrollByX(dx){ el.scrollBy({ left: dx, behavior: "smooth" }); }
    left.addEventListener("click", () => scrollByX(-220));
    right.addEventListener("click", () => scrollByX(220));
    window.addEventListener("resize", refresh);
    setTimeout(refresh, 60);
    refresh();
  })();

  /* ===== MENU BURGER ===== */
  (function initBurger(){
    const burger = document.getElementById("burger");
    const mobileNav = document.getElementById("mobileNav");
    const close = document.getElementById("mobileClose");
    if(!burger || !mobileNav || !close) return;

    function open(){
      mobileNav.classList.add("open");
      mobileNav.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    }
    function shut(){
      mobileNav.classList.remove("open");
      mobileNav.setAttribute("aria-hidden","true");
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", open);
    close.addEventListener("click", shut);
    mobileNav.addEventListener("click", (e)=>{ if(e.target === mobileNav) shut(); });
    window.addEventListener("keydown", (e)=>{ if(e.key === "Escape") shut(); });
  })();

  // Portfolio filter (portfolio.html)
  (function(){
    const segs = Array.from(document.querySelectorAll(".seg"));
    const shots = Array.from(document.querySelectorAll(".shot"));
    if(!segs.length || !shots.length) return;

    function setCat(cat){
      segs.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
      shots.forEach(it => it.style.display = (it.dataset.cat === cat) ? "" : "none");
    }
    segs.forEach(btn => btn.addEventListener("click", () => setCat(btn.dataset.cat)));
    setCat(segs[0].dataset.cat || "visuels");
  })();

  // Lightbox (portfolio.html)
  (function(){
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    const lbTitle = document.getElementById("lbTitle");
    const lbClose = document.getElementById("lbClose");
    const lbZoom = document.getElementById("lbZoom");
    const lbArea = document.getElementById("lbArea");
    if(!lb || !lbImg || !lbTitle || !lbClose || !lbZoom || !lbArea) return;

    function openLB(src, title){
      lbTitle.textContent = title || "Aperçu";
      lbImg.src = src;
      lbImg.alt = title || "Aperçu";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lbArea.classList.remove("zoom");
      lbImg.style.transform = "scale(1)";
      lbZoom.textContent = "Zoom";
    }
    function closeLB(){
      lb.classList.remove("open");
      lbImg.src = "";
      document.body.style.overflow = "";
      lbArea.classList.remove("zoom");
      lbImg.style.transform = "scale(1)";
      lbZoom.textContent = "Zoom";
    }
    function toggleZoom(){
      const on = lbArea.classList.toggle("zoom");
      lbZoom.textContent = on ? "Adapter" : "Zoom";
      lbImg.style.transform = "scale(1)";
    }

    lbClose.addEventListener("click", closeLB);
    lb.addEventListener("click", (e) => { if(e.target === lb) closeLB(); });
    window.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLB(); });

    lbZoom.addEventListener("click", toggleZoom);
    lbArea.addEventListener("click", (e) => {
      if(e.target === lbImg || e.target === lbArea) toggleZoom();
    });

    let z = 1;
    lbArea.addEventListener("wheel", (e) => {
      if(!lbArea.classList.contains("zoom")) return;
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      z = Math.max(1, Math.min(3, z + (delta > 0 ? -0.12 : 0.12)));
      lbImg.style.transform = `scale(${z.toFixed(2)})`;
    }, { passive:false });

    document.querySelectorAll(".shot").forEach(s => {
      s.addEventListener("click", () => {
        const src = s.getAttribute("data-src");
        const title = s.getAttribute("data-title");
        if(src) openLB(src, title);
      });
    });
  })();

  /* ===== AVIS (INDEX) ===== */
  (function initReviews(){
    const track = document.getElementById("reviewsTrack");
    const dots = document.getElementById("revDots");
    const prev = document.getElementById("revPrev");
    const next = document.getElementById("revNext");
    const wrap = track?.closest(".reviews");
    if(!track || !dots || !prev || !next) return;

    const reviews = [
      { name:"Dorian", stars:5, text:"Je recommande grandement ses services ! Très professionnel et réactive. Visité en février." },
      { name:"Sheylie Berkane", stars:5, text:"Je recommande vivement pour ses services et sa réactivité c’était un grand plaisir d’obtenir son aide ! Visité en février." },
      { name:"Sandiyya", stars:5, text:"Je recommande sans hésiter ses services ! Visité en janvier." }
    ];

    function starsStr(n){
      const x = Math.max(0, Math.min(5, n));
      return "★".repeat(x) + "☆".repeat(5 - x);
    }

    track.innerHTML = reviews.map(r => `
      <div class="review" role="group" aria-label="Avis client">
        <div class="revTop">
          <div class="revName">${r.name}</div>
          <div class="revStars" aria-label="${r.stars} sur 5">${starsStr(r.stars)}</div>
        </div>
        <div class="revText">${r.text}</div>
      </div>
    `).join("");

    const mq = window.matchMedia("(min-width: 980px)");
    let idx = 0;
    let timer = null;

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
    }
    function nextOne(){ go(idx + 1, true); }
    function prevOne(){ go(idx - 1, true); }

    prev.addEventListener("click", prevOne);
    next.addEventListener("click", nextOne);

    function start(){
      stop();
      if(pages() <= 1) return;
      timer = setInterval(nextOne, 4200);
    }
    function stop(){
      if(timer){ clearInterval(timer); timer = null; }
    }

    wrap?.addEventListener("mouseenter", stop);
    wrap?.addEventListener("mouseleave", start);
    wrap?.addEventListener("focusin", stop);
    wrap?.addEventListener("focusout", start);

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
})();
