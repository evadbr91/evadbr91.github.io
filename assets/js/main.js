// Year
document.getElementById("y")?.textContent = new Date().getFullYear();

// Reveal on scroll
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

// Nav arrows (scroll)
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

// Active nav link by current page
(function(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".links a").forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    const isActive =
      (path === "" && href.endsWith("index.html")) ||
      (path === "index.html" && href.endsWith("index.html")) ||
      (path === "services.html" && href.endsWith("services.html")) ||
      (path === "portfolio.html" && href.endsWith("portfolio.html")) ||
      (path === "contact.html" && href.endsWith("contact.html"));
    if(isActive) a.classList.add("active");
  });
})();

// Portfolio filters (blocks)
(function(){
  const segs = Array.from(document.querySelectorAll(".seg"));
  if(!segs.length) return;

  const blocks = Array.from(document.querySelectorAll("[data-block]"));
  function setCat(cat){
    segs.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
    blocks.forEach(bl => bl.style.display = (bl.dataset.block === cat) ? "" : "none");
  }
  segs.forEach(btn => btn.addEventListener("click", () => setCat(btn.dataset.cat)));
  setCat("visuels");
})();

// Lightbox (only on pages where it exists)
(function(){
  const lb = document.getElementById("lightbox");
  if(!lb) return;

  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbClose = document.getElementById("lbClose");
  const lbZoom = document.getElementById("lbZoom");
  const lbArea = document.getElementById("lbArea");
  const shots = Array.from(document.querySelectorAll(".shot"));

  let z = 1;

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
    z = 1;
  }
  function closeLB(){
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden","true");
    lbImg.src = "";
    document.body.style.overflow = "";
    lbArea.classList.remove("zoom");
    lbImg.style.transform = "scale(1)";
    lbZoom.textContent = "Zoom";
    z = 1;
  }
  function toggleZoom(){
    const on = lbArea.classList.toggle("zoom");
    lbZoom.textContent = on ? "Adapter" : "Zoom";
    lbImg.style.transform = "scale(1)";
    z = 1;
  }

  lbClose?.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => { if(e.target === lb) closeLB(); });
  window.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLB(); });

  lbZoom?.addEventListener("click", toggleZoom);
  lbArea?.addEventListener("click", (e) => {
    if(e.target === lbImg || e.target === lbArea) toggleZoom();
  });

  lbArea?.addEventListener("wheel", (e) => {
    if(!lbArea.classList.contains("zoom")) return;
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    z = Math.max(1, Math.min(3, z + (delta > 0 ? -0.12 : 0.12)));
    lbImg.style.transform = `scale(${z.toFixed(2)})`;
  }, { passive:false });

  shots.forEach(s => {
    s.addEventListener("click", () => {
      const src = s.getAttribute("data-src");
      const title = s.getAttribute("data-title");
      if(src) openLB(src, title);
    });
  });
})();

// Web carousel arrows (only if present)
(function(){
  const track = document.getElementById("webTrack");
  const prev = document.getElementById("webPrev");
  const next = document.getElementById("webNext");
  if(!track || !prev || !next) return;

  function isDesktop(){ return window.matchMedia("(min-width: 980px)").matches; }

  function refresh(){
    if(isDesktop()){
      prev.style.display = "none";
      next.style.display = "none";
      return;
    }
    const overflow = track.scrollWidth > track.clientWidth + 4;
    prev.style.display = overflow ? "inline-flex" : "none";
    next.style.display = overflow ? "inline-flex" : "none";
  }

  function scrollByCard(dir){
    const card = track.querySelector(".webCard");
    const dx = (card ? card.getBoundingClientRect().width : 320) + 12;
    track.scrollBy({ left: dir * dx, behavior:"smooth" });
  }

  prev.addEventListener("click", () => scrollByCard(-1));
  next.addEventListener("click", () => scrollByCard(1));
  window.addEventListener("resize", () => setTimeout(refresh, 50));
  setTimeout(refresh, 80);
  refresh();
})();
