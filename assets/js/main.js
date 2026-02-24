(function(){
  const year = document.getElementById("y");
  if(year) year.textContent = new Date().getFullYear();

  // Highlight active menu item
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".links a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if(href === path) a.classList.add("active");
  });

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

  // Type titles (optional)
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

  // Horizontal nav arrows
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
})();
