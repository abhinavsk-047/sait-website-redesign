document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelector(".nav-links");
  const menuBtn = document.querySelector(".menu-btn");
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const toast = document.querySelector("#toast");
  const command = document.querySelector("#command");
  const commandInput = document.querySelector("#commandInput");
  const commandList = document.querySelector("#commandList");
  let toastTimer;

  const page = document.body.dataset.page || "";

  // Theme
  const storedTheme = localStorage.getItem("sait-theme");
  if (storedTheme === "light") body.dataset.theme = "light";
  function refreshThemeIcon() {
    if (themeBtn) themeBtn.textContent = body.dataset.theme === "light" ? "☾" : "☀";
  }
  refreshThemeIcon();
  themeBtn?.addEventListener("click", () => {
    if (body.dataset.theme === "light") {
      delete body.dataset.theme;
      localStorage.setItem("sait-theme", "dark");
    } else {
      body.dataset.theme = "light";
      localStorage.setItem("sait-theme", "light");
    }
    refreshThemeIcon();
  });

  // Nav
  menuBtn?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    });
  });
  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", updateHeader, {passive:true});
  updateHeader();

  // Active page link
  document.querySelectorAll(".nav-links a[data-page]").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });

  // Reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Counter
  document.querySelectorAll("[data-counter]").forEach(el => {
    const target = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    let done = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || done) return;
      done = true;
      const start = performance.now();
      const duration = 950;
      function tick(t) {
        const p = Math.min((t-start)/duration,1);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = Math.round(target*eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.disconnect();
    });
    observer.observe(el);
  });

  // Cursor glow
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  body.appendChild(glow);
  if (window.innerWidth > 900) {
    window.addEventListener("pointermove", e => {
      glow.style.opacity = "1";
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, {passive:true});
    window.addEventListener("pointerleave", () => glow.style.opacity = "0");
  }

  // Subtle hero tilt
  const tilt = document.querySelector("[data-tilt]");
  if (tilt && window.innerWidth > 900 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tilt.addEventListener("pointermove", e => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      tilt.style.transform = `perspective(1000px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) rotateZ(2deg)`;
    });
    tilt.addEventListener("pointerleave", () => tilt.style.transform = "rotateZ(3deg)");
  }

  // Command palette
  const closeCommand = () => {
    command?.classList.remove("open");
    body.classList.remove("page-lock");
  };
  const openCommand = () => {
    command?.classList.add("open");
    body.classList.add("page-lock");
    commandInput?.focus();
    renderCommand("");
  };
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommand();
    }
    if (e.key === "Escape") {
      closeCommand();
      closeModal();
    }
  });
  document.querySelectorAll("[data-command-open]").forEach(el => el.addEventListener("click", openCommand));
  command?.addEventListener("click", e => { if (e.target.dataset.closeCommand !== undefined) closeCommand(); });

  const commands = [
    ["Home","index.html","⌂"],["About","about.html","01"],["People & Teams","people.html","02"],
    ["Events","events.html","03"],["Placements","placements.html","04"],["Alumni","alumni.html","05"],
    ["Hall of Fame","hall-of-fame.html","06"],["Activity Logger","activity.html","07"],
    ["Notifications","notifications.html","08"],["Notes & Resources","notes.html","09"],["Contact","contact.html","10"]
  ];
  function renderCommand(q="") {
    if (!commandList) return;
    const needle = q.trim().toLowerCase();
    const out = commands.filter(c => !needle || c[0].toLowerCase().includes(needle))
      .map(c => `<a class="command-item" href="${c[1]}"><div><strong>${c[0]}</strong><small>${c[1]}</small></div><span class="command-key">${c[2]}</span></a>`).join("");
    commandList.innerHTML = out || `<div class="command-item"><div><strong>No results</strong><small>Try “events”, “people”, or “notes”.</small></div></div>`;
  }
  commandInput?.addEventListener("input", e => renderCommand(e.target.value));
  renderCommand();

  // Toast
  window.saitToast = msg => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  };

  // Modal helpers
  const modal = document.querySelector("#modal");
  const closeModal = () => {
    modal?.classList.remove("open");
    body.classList.remove("page-lock");
  };
  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  function openModal(title, subtitle, image, bodyText, cta) {
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal-bg" data-close-modal></div>
      <div class="modal-card">
        ${image ? `<div class="modal-media"><img src="${image}" alt=""></div>` : ""}
        <button class="modal-close" data-close-modal>×</button>
        <div class="modal-content">
          <div class="kicker">${subtitle || "SAIT / DETAIL"}</div>
          <h2>${title}</h2>
          <p>${bodyText}</p>
          ${cta || ""}
        </div>
      </div>`;
    modal.classList.add("open");
    body.classList.add("page-lock");
    modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  }

  // Render utility functions
  function eventCard(e, small=false) {
    return `<article class="event-card reveal">
      <div class="event-image"><img src="${e.image}" alt="" loading="lazy"><span class="badge">${e.category}</span></div>
      <div class="event-info">
        <div class="event-row"><span>${e.date} · ${e.time}</span><span>${e.status}</span></div>
        <h3>${e.title}</h3>
        <p>${e.desc}</p>
        <div class="event-foot"><span class="tag">${e.venue}</span><button class="btn small ghost" data-event-id="${e.id}">View details ↗</button></div>
      </div>
    </article>`;
  }

  function personCard(p) {
    return `<article class="person-card reveal" data-person-type="${p.type}">
      <div class="person-photo"><img src="${p.photo}" alt="${p.name}" loading="lazy">
        <div class="person-label"><span>${p.role}</span><span>${p.type}</span></div>
      </div>
      <div class="person-body">
        <h3>${p.name}</h3>
        <p>${p.team}<br>${p.bio}</p>
        <div class="person-links"><button class="btn small ghost" data-person-id="${p.id}">Profile ↗</button></div>
      </div>
    </article>`;
  }

  // Events render
  const eventsTarget = document.querySelector("[data-events]");
  if (eventsTarget) {
    const filterTarget = document.querySelector("[data-event-filters]");
    const cats = ["ALL", ...new Set(SAIT_DATA.events.map(e => e.category))];
    if (filterTarget) filterTarget.innerHTML = cats.map((c,i)=>`<button class="filter-btn ${i===0?"active":""}" data-filter="${c}">${c}</button>`).join("");
    const render = filter => {
      eventsTarget.innerHTML = SAIT_DATA.events.filter(e => filter==="ALL" || e.category===filter).map(eventCard).join("");
      wireEvents();
      eventsTarget.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
    };
    const wireEvents = () => eventsTarget.querySelectorAll("[data-event-id]").forEach(btn => btn.addEventListener("click",()=>{
      const e=SAIT_DATA.events.find(x=>x.id===btn.dataset.eventId);
      openModal(e.title, `${e.category} · ${e.date}`, e.image, `${e.desc} <br><br><b>Venue:</b> ${e.venue}<br><b>Time:</b> ${e.time}<br><b>Status:</b> ${e.status}`, `<a class="btn primary" href="contact.html">Get updates ↗</a>`);
    }));
    filterTarget?.addEventListener("click",e=>{
      if(!e.target.dataset.filter)return;
      filterTarget.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      e.target.classList.add("active");
      render(e.target.dataset.filter);
    });
    render("ALL");
  }

  // People render
  const peopleTarget = document.querySelector("[data-people]");
  if (peopleTarget) {
    const filterTarget = document.querySelector("[data-people-filters]");
    const cats=["ALL","OFFICIAL","FACULTY","STUDENT"];
    if(filterTarget)filterTarget.innerHTML=cats.map((c,i)=>`<button class="filter-btn ${i===0?"active":""}" data-person-filter="${c}">${c}</button>`).join("");
    const render = filter => {
      peopleTarget.innerHTML=SAIT_DATA.people.filter(p=>filter==="ALL"||p.type===filter.toLowerCase()).map(personCard).join("");
      peopleTarget.querySelectorAll("[data-person-id]").forEach(btn=>btn.addEventListener("click",()=>{
        const p=SAIT_DATA.people.find(x=>x.id===btn.dataset.personId);
        openModal(p.name,p.role,p.photo,`${p.bio}<br><br><b>Area:</b> ${p.team}<br><span class="dim">Sample profile — replace with official SAIT directory data.</span>`);
      }));
      peopleTarget.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
    };
    filterTarget?.addEventListener("click",e=>{
      if(!e.target.dataset.personFilter)return;
      filterTarget.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      e.target.classList.add("active");
      render(e.target.dataset.personFilter);
    });
    render("ALL");
  }

  // Alumni render
  const alumniTarget=document.querySelector("[data-alumni]");
  if(alumniTarget){
    alumniTarget.innerHTML=SAIT_DATA.alumni.map(a=>`
      <article class="alumni-card reveal">
        <img src="${a.photo}" alt="${a.name}" loading="lazy">
        <div class="body">
          <div class="meta-line"><span>BATCH ${a.batch}</span><span>${a.highlight}</span></div>
          <div class="quote">“${a.quote}”</div>
          <div class="small">${a.name} · ${a.role}</div>
        </div>
      </article>`).join("");
    alumniTarget.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
  }

  // Hall render
  const hallTarget=document.querySelector("[data-hall]");
  if(hallTarget){
    hallTarget.innerHTML=SAIT_DATA.hall.map(h=>`
      <article class="hall-item reveal">
        <div class="hall-year">${h.year}</div>
        <div><span class="tag">${h.tag}</span><h3>${h.title}</h3><p>${h.meta}</p></div>
        <div class="hall-arrow">↗</div>
      </article>`).join("");
    hallTarget.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
  }

  // Notifications render
  const noticeTarget=document.querySelector("[data-notifications]");
  if(noticeTarget){
    const filterTarget=document.querySelector("[data-notice-filters]");
    const cats=["ALL",...new Set(SAIT_DATA.notifications.map(n=>n.tag))];
    if(filterTarget)filterTarget.innerHTML=cats.map((c,i)=>`<button class="filter-btn ${i===0?"active":""}" data-notice-filter="${c}">${c}</button>`).join("");
    const render=filter=>{
      noticeTarget.innerHTML=SAIT_DATA.notifications.filter(n=>filter==="ALL"||n.tag===filter).map(n=>`
        <article class="notice reveal">
          <div class="notice-date">${n.date}</div>
          <div><span class="tag">${n.tag}</span><h3>${n.title}</h3><p>${n.body}</p></div>
          ${n.new?'<span class="new-pill">NEW</span>':''}
        </article>`).join("");
      noticeTarget.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
    };
    filterTarget?.addEventListener("click",e=>{
      if(!e.target.dataset.noticeFilter)return;
      filterTarget.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      e.target.classList.add("active");render(e.target.dataset.noticeFilter);
    });
    render("ALL");
  }

  // Activity logger
  const activityForm=document.querySelector("#activityForm");
  const activityList=document.querySelector("#activityList");
  const activityRing=document.querySelector("#activityRingValue");
  const storageKey="sait-activity-v1";
  const getActivities=()=>JSON.parse(localStorage.getItem(storageKey)||"[]");
  const renderActivities=()=>{
    if(!activityList)return;
    const arr=getActivities();
    activityList.innerHTML=(arr.length?arr:[{title:"No submissions yet",type:"Add your first activity above",status:"pending"}]).slice(0,6).map(a=>`
      <div class="activity-row">
        <div><strong>${a.title}</strong><small>${a.type}${a.date?" · "+a.date:""}</small></div>
        <span class="status ${a.status}">${(a.status||"pending").toUpperCase()}</span>
      </div>`).join("");
    const verified=arr.filter(a=>a.status==="verified").length;
    if(activityRing) activityRing.textContent = Math.min(99, 40+verified*12)+"%";
  };
  activityForm?.addEventListener("submit",e=>{
    e.preventDefault();
    const f=new FormData(activityForm);
    const title=f.get("title")?.trim();
    if(!title){saitToast("Add an activity title first.");return}
    const arr=getActivities();
    arr.unshift({
      title,
      type:f.get("type")||"General",
      date:f.get("date")||"",
      proof:f.get("proof")||"",
      status:"pending"
    });
    localStorage.setItem(storageKey,JSON.stringify(arr));
    activityForm.reset();
    renderActivities();
    saitToast("Activity saved locally — ready for verification.");
  });
  renderActivities();

  // Mini game: Campus Sprint
  const gameBoard = document.querySelector("#gameBoard");
  if (gameBoard) {
    const cells = [...gameBoard.querySelectorAll(".game-cell")];
    const scoreEl = document.querySelector("#gameScore");
    const timeEl = document.querySelector("#gameTime");
    const bestEl = document.querySelector("#gameBest");
    const startBtn = document.querySelector("#gameStartBtn");
    const gameMessage = document.querySelector("#gameMessage");
    let score = 0;
    let timeLeft = 20;
    let bestScore = Number(localStorage.getItem("sait-campus-sprint-best") || "0");
    let activeIndex = -1;
    let timerId = null;
    let spawnId = null;
    let playing = false;

    const clearBoard = () => {
      cells.forEach(cell => {
        cell.classList.remove("is-active", "hit", "miss");
      });
      activeIndex = -1;
    };

    const refreshBest = () => {
      if (bestEl) bestEl.textContent = String(bestScore);
    };

    const setMessage = msg => {
      if (gameMessage) gameMessage.textContent = msg;
    };

    const endGame = () => {
      playing = false;
      clearInterval(timerId);
      clearTimeout(spawnId);
      clearBoard();
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("sait-campus-sprint-best", String(bestScore));
        refreshBest();
      }
      setMessage(score >= 12 ? "Nice run — that was campus-fast." : "Run ended. Hit start and chase a higher score.");
    };

    const randomTarget = () => {
      if (!playing) return;
      const nextIndex = Math.floor(Math.random() * cells.length);
      activeIndex = nextIndex;
      cells.forEach((cell, index) => {
        cell.classList.toggle("is-active", index === nextIndex);
      });
      clearTimeout(spawnId);
      spawnId = setTimeout(() => {
        if (!playing || activeIndex !== nextIndex) return;
        cells[nextIndex].classList.add("miss");
        setTimeout(() => cells[nextIndex].classList.remove("miss"), 180);
        score = Math.max(0, score - 1);
        if (scoreEl) scoreEl.textContent = String(score);
        activeIndex = -1;
        randomTarget();
      }, 700);
    };

    const startGame = () => {
      if (playing) return;
      score = 0;
      timeLeft = 20;
      playing = true;
      if (scoreEl) scoreEl.textContent = "0";
      if (timeEl) timeEl.textContent = String(timeLeft);
      setMessage("Collect the glowing nodes.");
      clearBoard();
      clearInterval(timerId);
      clearTimeout(spawnId);
      timerId = setInterval(() => {
        timeLeft -= 1;
        if (timeEl) timeEl.textContent = String(timeLeft);
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
      randomTarget();
    };

    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        if (!playing) return;
        const index = Number(cell.dataset.index);
        if (index === activeIndex) {
          score += 1;
          if (scoreEl) scoreEl.textContent = String(score);
          cell.classList.add("hit");
          setTimeout(() => cell.classList.remove("hit"), 140);
          activeIndex = -1;
          clearTimeout(spawnId);
          randomTarget();
        } else {
          score = Math.max(0, score - 1);
          if (scoreEl) scoreEl.textContent = String(score);
          cell.classList.add("miss");
          setTimeout(() => cell.classList.remove("miss"), 160);
        }
      });
    });

    startBtn?.addEventListener("click", startGame);
    refreshBest();
  }

  // Demo contact forms
  document.querySelectorAll("form[data-demo-form]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      form.reset();
      saitToast("Thanks — your message was captured in this prototype.");
    });
  });

  // Share / copy
  document.querySelectorAll("[data-share]").forEach(btn=>{
    btn.addEventListener("click",async()=>{
      const url=location.href;
      try{
        if(navigator.share) await navigator.share({title:"SAIT CUSAT",url});
        else await navigator.clipboard.writeText(url);
        saitToast(navigator.share?"Share sheet opened.":"Link copied.");
      }catch{}
    });
  });
});