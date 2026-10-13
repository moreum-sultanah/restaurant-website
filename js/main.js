const header = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector("#mobile-menu");

// header turns solid once the page is scrolled a little
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// mobile menu
function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", open);
  menu.hidden = !open;
}

menuBtn.addEventListener("click", () => {
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});

menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

// dish cards flip on tap or Enter (hover handles it on desktop)
document.querySelectorAll(".dish").forEach((dish) => {
  const flip = () => dish.classList.toggle("is-flipped");
  dish.addEventListener("click", flip);
  dish.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  });
});

// no map address yet, so the link shouldn't jump anywhere
document.querySelector("[data-map]").addEventListener("click", (e) => e.preventDefault());

// fade elements in as they scroll into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("is-visible");
    el.addEventListener("transitionend", () => el.style.removeProperty("--delay"), { once: true });
    observer.unobserve(el);
  });
}, { threshold: 0.05 });

const siblingCount = new Map();

document.querySelectorAll("[data-reveal]").forEach((el) => {
  const parent = el.parentElement;
  const index = siblingCount.get(parent) || 0;
  siblingCount.set(parent, index + 1);

  // grids stagger by column, everything else by order
  const step = el.dataset.reveal === "grid" ? index % 4 : Math.min(index, 5);
  const extra = el.closest(".hero") ? 150 : 0;
  el.style.setProperty("--delay", step * 90 + extra + "ms");

  observer.observe(el);
});
