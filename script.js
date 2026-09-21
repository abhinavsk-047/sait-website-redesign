const body = document.body;
const header = document.querySelector(".site-header");
const navLinks = document.querySelector("#navLinks");
const menuBtn = document.querySelector("#menuBtn");
const themeToggle = document.querySelector("#themeToggle");
const modal = document.querySelector("#eventModal");
const modalTitle = document.querySelector("#modalTitle");

// Mobile navigation
menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// Close mobile menu after selecting a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Header state + active section
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];

function updateNavigation() {
  header.classList.toggle("scrolled", window.scrollY > 20);

  let current = "top";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });

  links.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", updateNavigation, { passive: true });
updateNavigation();

// Theme toggle
const savedTheme = localStorage.getItem("sait-theme");
if (savedTheme === "dark") body.dataset.theme = "dark";

function updateThemeIcon() {
  themeToggle.textContent = body.dataset.theme === "dark" ? "☀" : "◐";
}
updateThemeIcon();

themeToggle.addEventListener("click", () => {
  if (body.dataset.theme === "dark") {
    delete body.dataset.theme;
    localStorage.setItem("sait-theme", "light");
  } else {
    body.dataset.theme = "dark";
    localStorage.setItem("sait-theme", "dark");
  }
  updateThemeIcon();
});

// Reveal-on-scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Event modal
function openModal(name) {
  modalTitle.textContent = name;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".event-link").forEach(button => {
  button.addEventListener("click", () => openModal(button.dataset.event));
});

modal.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// Small cursor glow on desktop
const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

Object.assign(glow.style, {
  position: "fixed",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  pointerEvents: "none",
  zIndex: "1",
  opacity: "0",
  transform: "translate(-50%, -50%)",
  background: "radial-gradient(circle, rgba(157,124,255,.08), transparent 68%)",
  transition: "opacity .25s"
});

window.addEventListener("pointermove", (event) => {
  if (window.innerWidth > 900) {
    glow.style.opacity = "1";
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
}, { passive: true });

window.addEventListener("pointerleave", () => glow.style.opacity = "0");
