const body = document.body;
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav-list a");
const heroMedia = document.querySelectorAll(".hero-media");
const heroVideos = document.querySelectorAll(".hero-media video");
const planCards = document.querySelectorAll(".plan-card");
const scheduleRows = document.querySelectorAll(".schedule-row");

heroMedia.forEach((item, index) => {
  item.style.setProperty("--media-delay", `${index * 260}ms`);
});

window.addEventListener("load", () => {
  heroMedia.forEach((item) => {
    item.classList.add("is-visible");
  });
});

heroVideos.forEach((video) => {
  const setSlowMotion = () => {
    video.playbackRate = 0.6;
  };

  video.addEventListener("loadeddata", setSlowMotion);
  video.addEventListener("play", setSlowMotion);

  if (video.readyState >= 2) {
    setSlowMotion();
  }
});

planCards.forEach((card, index) => {
  card.style.setProperty("--card-delay", `${index * 140}ms`);
});

if ("IntersectionObserver" in window && planCards.length) {
  const planCardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  planCards.forEach((card) => {
    planCardObserver.observe(card);
  });
} else {
  planCards.forEach((card) => {
    card.classList.add("is-revealed");
  });
}

scheduleRows.forEach((item, index) => {
  item.style.setProperty("--row-delay", `${index * 140}ms`);
});

if ("IntersectionObserver" in window && scheduleRows.length) {
  const scheduleRowObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  scheduleRows.forEach((item) => {
    scheduleRowObserver.observe(item);
  });
} else {
  scheduleRows.forEach((item) => {
    item.classList.add("is-visible");
  });
}

if (menuButton && mobileNav) {
  const closeMenu = () => {
    body.classList.remove("menu-open");
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  };

  const openMenu = () => {
    body.classList.add("menu-open");
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Fechar menu");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = body.classList.contains("menu-open");

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && body.classList.contains("menu-open")) {
      closeMenu();
    }
  });
}
