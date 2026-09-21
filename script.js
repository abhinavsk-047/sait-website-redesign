const root = document.documentElement;
const body = document.body;
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// ---------------------------
// Theme
// ---------------------------
const storedTheme = localStorage.getItem('sait-theme');
if (storedTheme) root.dataset.theme = storedTheme;
const themeButton = $('#themeButton');
function syncThemeIcon(){ themeButton.textContent = root.dataset.theme === 'light' ? '☾' : '☼'; }
syncThemeIcon();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('sait-theme', root.dataset.theme);
  syncThemeIcon();
  showToast(`${root.dataset.theme === 'light' ? 'Light' : 'Dark'} mode enabled`);
});

// ---------------------------
// Header + scroll progress
// ---------------------------
const header = $('#header');
const progress = $('#pageProgress');
function updateScrollUI(){
  header.classList.toggle('scrolled', window.scrollY > 18);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

// ---------------------------
// Mobile menu
// ---------------------------
const menuButton = $('#menuButton');
const nav = $('#primaryNav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
$$('.nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// ---------------------------
// Cursor glow
// ---------------------------
const cursorGlow = $('#cursorGlow');
window.addEventListener('pointermove', (e) => {
  if (window.innerWidth < 1000) return;
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
}, {passive:true});
window.addEventListener('pointerleave', () => cursorGlow.style.opacity = '0');

// ---------------------------
// Reveal-on-scroll
// ---------------------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

// ---------------------------
// Animated counters
// ---------------------------
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = el.dataset.counter;
    if (target === '∞') return;
    const end = Number(target);
    const start = performance.now();
    const duration = 1100;
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, {threshold:.6});
$$('[data-counter]').forEach(el => counterObserver.observe(el));

// ---------------------------
// Interactive filters
// ---------------------------
function filterGroup(buttonSelector, itemSelector, dataName){
  $$(buttonSelector).forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset[dataName];
      $$(buttonSelector).forEach(b => b.classList.toggle('active', b === button));
      $$(itemSelector).forEach(item => {
        const match = value === 'all' || item.dataset[dataName.replace('Filter','Category').replace('team','team')] === value;
        item.classList.toggle('hidden', !match);
      });
    });
  });
}

// Teams
$$('[data-team-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.teamFilter;
    $$('[data-team-filter]').forEach(b => b.classList.toggle('active', b === button));
    $$('#peopleGrid .person-card').forEach(card => card.classList.toggle('hidden', value !== 'all' && card.dataset.team !== value));
  });
});
// Events
$$('[data-event-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.eventFilter;
    $$('[data-event-filter]').forEach(b => b.classList.toggle('active', b === button));
    $$('[data-event-category]').forEach(card => card.classList.toggle('hidden', value !== 'all' && card.dataset.eventCategory !== value));
  });
});
// Hall of fame
$$('[data-hall-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.hallFilter;
    $$('[data-hall-filter]').forEach(b => b.classList.toggle('active', b === button));
    $$('#hallGrid .hall-card').forEach(card => card.classList.toggle('hidden', value !== 'all' && card.dataset.hallCategory !== value));
  });
});

// ---------------------------
// Modal system
// ---------------------------
const modalLayer = $('#modalLayer');
const modalHeading = $('#modalHeading');
const modalBody = $('#modalBody');
function openModal(title, message){
  modalHeading.textContent = title;
  modalBody.textContent = message;
  modalLayer.classList.add('open');
  modalLayer.setAttribute('aria-hidden','false');
  body.style.overflow = 'hidden';
}
function closeModal(){
  modalLayer.classList.remove('open');
  modalLayer.setAttribute('aria-hidden','true');
  body.style.overflow = '';
}
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
$$('.event-open').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.eventName, 'Prototype interaction ready. Connect this card to the real SAIT event database, registration URL or event detail page in the final build.')));
$$('.person-open').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.person, 'This member/team profile is a prototype. Replace this with verified role, batch, skills, social links and contact information when official data is available.')));

// ---------------------------
// Command palette / search
// ---------------------------
const commandLayer = $('#commandLayer');
const commandInput = $('#commandInput');
const commandResults = $('#commandResults');
const commands = [
  {title:'About SAIT', meta:'Vision · Mission · History', href:'#about'},
  {title:'People & Teams', meta:'Executive · Tech · Media · Events · PR', href:'#people'},
  {title:'Events & Activities', meta:'Upcoming · Archive · Filters', href:'#events'},
  {title:'Placements & Careers', meta:'Stats · Pathways · Resources', href:'#careers'},
  {title:'Alumni', meta:'Spotlights · Batches · Achievements', href:'#alumni'},
  {title:'Hall of Fame', meta:'Hackathons · Papers · Academic', href:'#hall'},
  {title:'Student Activity Logger', meta:'Submit · Track · Leaderboard', href:'#activity'},
  {title:'Notifications', meta:'Deadlines · Updates · Notices', href:'#notifications'},
  {title:'Contact SAIT', meta:'Questions · Collaborations · Proposals', href:'#contact'}
];
let selectedCommand = 0;
function renderCommands(query=''){
  const q = query.trim().toLowerCase();
  const filtered = commands.filter(c => !q || `${c.title} ${c.meta}`.toLowerCase().includes(q));
  if (!filtered.length){ commandResults.innerHTML = '<div class="command-item"><div><b>No results</b><small>Try another search</small></div></div>'; return; }
  selectedCommand = Math.min(selectedCommand, filtered.length - 1);
  commandResults.innerHTML = filtered.map((c,i)=>`<div class="command-item ${i===selectedCommand?'selected':''}" data-command-index="${i}"><div><b>${c.title}</b><small>${c.meta}</small></div><span>↗</span></div>`).join('');
  $$('.command-item[data-command-index]', commandResults).forEach((item,i)=>item.addEventListener('click',()=>goCommand(filtered[i])));
  function goCommand(cmd){ commandLayer.classList.remove('open'); body.style.overflow=''; window.location.hash=cmd.href.slice(1); }
}
function openCommand(){ commandLayer.classList.add('open'); commandLayer.setAttribute('aria-hidden','false'); body.style.overflow='hidden'; commandInput.value=''; renderCommands(); setTimeout(()=>commandInput.focus(),20); }
function closeCommand(){ commandLayer.classList.remove('open'); commandLayer.setAttribute('aria-hidden','true'); body.style.overflow=''; }
$('#searchButton').addEventListener('click', openCommand);
$('#commandHint').addEventListener('click', openCommand);
$$('[data-close-command]').forEach(el => el.addEventListener('click', closeCommand));
commandInput.addEventListener('input', () => { selectedCommand=0; renderCommands(commandInput.value); });

document.addEventListener('keydown', (event) => {
  const macLike = navigator.platform.toUpperCase().includes('MAC');
  if ((macLike ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommand(); }
  if (event.key === 'Escape') { closeModal(); closeCommand(); }
  if (commandLayer.classList.contains('open') && ['ArrowDown','ArrowUp','Enter'].includes(event.key)) {
    const q = commandInput.value.trim().toLowerCase();
    const filtered = commands.filter(c => !q || `${c.title} ${c.meta}`.toLowerCase().includes(q));
    if (!filtered.length) return;
    if (event.key === 'ArrowDown') selectedCommand=(selectedCommand+1)%filtered.length;
    if (event.key === 'ArrowUp') selectedCommand=(selectedCommand-1+filtered.length)%filtered.length;
    if (event.key === 'Enter') { commandLayer.classList.remove('open'); body.style.overflow=''; window.location.hash=filtered[selectedCommand].href.slice(1); }
    renderCommands(q);
    event.preventDefault();
  }
});

// ---------------------------
// Activity logger — local demo persistence
// ---------------------------
const activityForm = $('#activityForm');
const activityFeed = $('#activityFeed');
const emptyFeed = $('#emptyFeed');
const activityCount = $('#activityCount');
const progressValue = $('#progressValue');
const ringProgress = $('#ringProgress');
const storageKey = 'sait-activities';
let activities = JSON.parse(localStorage.getItem(storageKey) || '[]');
function iconForCategory(category){ return ({Technical:'⌘',Academic:'◇',Community:'✦',Creative:'✳'})[category] || '•'; }
function renderActivities(){
  activityCount.textContent = activities.length;
  const pct = Math.min(100, activities.length * 20);
  progressValue.textContent = `${pct}%`;
  ringProgress.style.strokeDashoffset = `${307.88 - (307.88 * pct / 100)}`;
  if (!activities.length) {
    emptyFeed.style.display='block';
    [...activityFeed.querySelectorAll('.feed-item')].forEach(e=>e.remove());
    return;
  }
  emptyFeed.style.display='none';
  [...activityFeed.querySelectorAll('.feed-item')].forEach(e=>e.remove());
  activities.slice().reverse().forEach(item=>{
    const div=document.createElement('article');
    div.className='feed-item';
    div.innerHTML=`<div class="feed-icon">${iconForCategory(item.category)}</div><div><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.student)} · ${escapeHTML(item.category)} · ${escapeHTML(item.date)}</p></div><span class="status-badge">SUBMITTED</span>`;
    activityFeed.appendChild(div);
  });
}
function escapeHTML(str){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
activityForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(activityForm);
  const item = Object.fromEntries(data.entries());
  activities.push(item);
  localStorage.setItem(storageKey, JSON.stringify(activities));
  activityForm.reset();
  renderActivities();
  showToast('Activity submitted to your local demo dashboard');
});
renderActivities();

// ---------------------------
// Contact form UI
// ---------------------------
const contactForm = $('#contactForm');
contactForm.addEventListener('submit', e => { e.preventDefault(); $('#contactSuccess').hidden=false; contactForm.reset(); showToast('Message captured locally — connect a backend for production'); });

// ---------------------------
// Notification center
// ---------------------------
$('#notifyButton').addEventListener('click', () => openModal('Notification Center', 'This prototype turns announcements into a focused feed. Connect it to a CMS, Firebase, Supabase or your preferred backend in the production version.'));

// ---------------------------
// Toast
// ---------------------------
const toast = $('#toast');
let toastTimer;
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 2800);
}

// ---------------------------
// Hero parallax / card tilt
// ---------------------------
const heroStage = $('.hero-stage');
const heroCore = $('.hero-core');
heroStage.addEventListener('pointermove', e => {
  if (window.innerWidth < 1000) return;
  const r = heroStage.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;
  heroCore.style.transform = `rotateY(${-7 + x*7}deg) rotateX(${y*-4}deg) rotateZ(${2.5 + x*1.2}deg) translate(${x*8}px,${y*8}px)`;
});
heroStage.addEventListener('pointerleave', ()=> heroCore.style.transform='rotateY(-7deg) rotateZ(2.5deg)');

// Set today's date as a convenient default for the prototype
const activityDate = $('#activityDate');
if (activityDate) activityDate.valueAsDate = new Date();
