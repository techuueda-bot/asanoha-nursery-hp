const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const revealTargets = document.querySelectorAll(".reveal");
const heroPhotoWindows = document.querySelectorAll(".hero .mark-photo-window");
const contactForm = document.querySelector(".contact-form");

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const existingMessage = contactForm.querySelector(".form-submit-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const message = document.createElement("p");
    message.className = "form-submit-message";
    message.textContent = "送信デモです。実際の送信は行われません。";
    contactForm.appendChild(message);
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const startPhotoRotation = (windowElement, interval, offset = 0) => {
  const images = Array.from(windowElement.querySelectorAll("img"));

  if (images.length < 2) {
    return;
  }

  let activeIndex = images.findIndex((image) => image.classList.contains("is-active"));

  if (activeIndex < 0) {
    activeIndex = 0;
    images[activeIndex].classList.add("is-active");
  }

  const showNext = () => {
    const device = windowElement.closest(".hero-mark-device");

    images[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % images.length;
    images[activeIndex].classList.add("is-active");

    if (device) {
      device.classList.add("is-changing");
      window.setTimeout(() => {
        device.classList.remove("is-changing");
      }, 1000);
    }
  };

  window.setTimeout(() => {
    showNext();
    window.setInterval(showNext, interval);
  }, interval + offset);
};

const supportsReveal = "IntersectionObserver" in window;

if (prefersReducedMotion || !supportsReveal) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  // Only opt into the hidden reveal start-state now that JS is running and the
  // observer is about to drive it. If this script never executes (JS disabled,
  // failed to load) or the browser lacks IntersectionObserver, `.reveal-on` is
  // never set and the CSS fallback keeps all .reveal content visible.
  document.documentElement.classList.add("reveal-on");

  heroPhotoWindows.forEach((windowElement, index) => {
    const interval = [5200][index] || 5200;
    const offset = [0][index] || 0;
    startPhotoRotation(windowElement, interval, offset);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14,
    },
  );

  revealTargets.forEach((target) => observer.observe(target));
}
