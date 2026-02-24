// ✅ Main shared JS for all pages (safe if elements are missing)

(function(){
  // Year
  const y = document.getElementById("y");
  if(y) y.textContent = new Date().getFullYear();

  // Reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("on");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Typing titles
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

  // Top nav horizontal arrows (mobile)
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
    function scrollByX(dx){
      el.scrollBy({ left: dx, behavior: "smooth" });
    }
    left.addEventListener("click", () => scrollByX(-220));
    right.addEventListener("click", () => scrollByX(220));
    window.addEventListener("resize", refresh);
    setTimeout(refresh, 60);
    refresh();
  })();

  // Active nav link per page
  (function(){
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".links a").forEach(a=>{
      const href = (a.getAttribute("href") || "").toLowerCase();
      if(href.endsWith(path)) a.classList.add("active");
      if(path === "" && href.endsWith("index.html")) a.classList.add("active");
    });
  })();

  // Instagram button
  const IG_URL = "https://www.instagram.com/edbra_nd/";
  const igBtn = document.getElementById("igBtn");
  if(igBtn && IG_URL.startsWith("http")){
    igBtn.href = IG_URL;
    igBtn.target = "_blank";
    igBtn.rel = "noopener";
    igBtn.textContent = "Instagram";
    igBtn.removeAttribute("aria-disabled");
    igBtn.removeAttribute("title");
  }

  // Gallery filter (if present)
  (function(){
    const segs = Array.from(document.querySelectorAll(".seg"));
    const shots = Array.from(document.querySelectorAll(".shot"));
    if(!segs.length || !shots.length) return;

    function setCat(cat){
      segs.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
      shots.forEach(it => it.style.display = (it.dataset.cat === cat) ? "" : "none");
    }
    segs.forEach(btn => btn.addEventListener("click", () => setCat(btn.dataset.cat)));
    setCat(segs.find(s=>s.classList.contains("active"))?.dataset.cat || "visuels");
  })();

  // Lightbox (images)
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
      lb.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
      lbArea.classList.remove("zoom");
      lbImg.style.transform = "scale(1)";
      lbZoom.textContent = "Zoom";
    }
    function closeLB(){
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden","true");
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

  // Contact: copy email
  (function(){
    const EMAIL = "deabreue9@gmail.com";
    const copyMailBtn = document.getElementById("copyMailBtn");
    if(!copyMailBtn) return;

    function copyToClipboard(text){
      if(navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
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
      copyMailBtn.textContent = "Copié ✅";
      setTimeout(() => copyMailBtn.textContent = "Copier mon email", 1200);
    });
  })();

  // Contact: form submit hint
  (function(){
    const quoteForm = document.getElementById("quoteForm");
    const successBox = document.getElementById("successBox");
    const sendBtn = document.getElementById("sendBtn");
    if(!quoteForm || !successBox || !sendBtn) return;
    quoteForm.addEventListener("submit", () => {
      sendBtn.textContent = "Envoi...";
      successBox.classList.add("on");
    });
  })();

  // Fill pack on click (if present)
  (function(){
    const packInput = document.getElementById("fPack");
    if(!packInput) return;

    function goContactWithPack(packName){
      if(packName) packInput.value = packName;
      document.getElementById("fEmail")?.focus?.();
    }
    document.querySelectorAll(".choosePack").forEach(btn => {
      btn.addEventListener("click", () => goContactWithPack(btn.getAttribute("data-pack") || ""));
    });
  })();

  // NEW: sites carousel arrows (if present)
  (function(){
    const track = document.getElementById("siteTrack");
    const prev = document.getElementById("sitePrev");
    const next = document.getElementById("siteNext");
    if(!track || !prev || !next) return;

    function refresh(){
      const overflow = track.scrollWidth > track.clientWidth + 4;
      prev.style.display = overflow ? "inline-flex" : "none";
      next.style.display = overflow ? "inline-flex" : "none";
    }

    function scrollByCard(dir){
      const card = track.querySelector(".site-card");
      const dx = (card ? card.getBoundingClientRect().width : 320) + 12;
      track.scrollBy({ left: dir * dx, behavior:"smooth" });
    }
    prev.addEventListener("click", () => scrollByCard(-1));
    next.addEventListener("click", () => scrollByCard(1));
    window.addEventListener("resize", () => setTimeout(refresh, 50));
    setTimeout(refresh, 80);
    refresh();
  })();

  // NEW: Site preview modal (iframe)
  (function(){
    const openBtns = document.querySelectorAll("[data-site-preview]");
    const modal = document.getElementById("siteModal");
    const frame = document.getElementById("siteFrame");
    const title = document.getElementById("siteModalTitle");
    const close = document.getElementById("siteModalClose");
    const openNew = document.getElementById("siteModalOpen");
    if(!openBtns.length || !modal || !frame || !title || !close || !openNew) return;

    function open(url, t){
      title.textContent = t || "Aperçu du site";
      frame.src = url;
      openNew.href = url;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    }
    function shut(){
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden","true");
      frame.src = "";
      document.body.style.overflow = "";
    }

    openBtns.forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const url = btn.getAttribute("data-site-preview");
        const t = btn.getAttribute("data-site-title") || "Aperçu du site";
        if(url) open(url, t);
      });
    });

    close.addEventListener("click", shut);
    modal.addEventListener("click", (e)=>{ if(e.target === modal) shut(); });
    window.addEventListener("keydown", (e)=>{ if(e.key === "Escape") shut(); });
  })();

})();
