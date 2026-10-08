"use strict";

// CONFIGURACIÓN
// Número internacional con código de país, únicamente dígitos.
const WHATSAPP_NUMBER = "573160268812";

// Todas las fotografías se configuran aquí.
// Son imágenes editoriales de referencia, no fotos reales de Monarca.
// Las fotos, el mapa y las fuentes requieren conexión; el HTML, CSS y JS son locales.
// logoOfficial acepta un data URI para incrustar el archivo oficial.
const IMAGES = {
  logoOfficial: "",
  hero: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=85",
  laser: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80",
  facial: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80",
  body: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=700&q=80",
  experience: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
  detail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=450&q=80",
  technology: ""
};

const INSTAGRAM_URL = "https://www.instagram.com/monarca_estetica";
const MAP_QUERY = "Monarca Estética Láser, Centro Comercial Villa Country, Barranquilla, Atlántico, Colombia";
const whatsappMessage = encodeURIComponent(
  "Hola, quiero agendar una valoración gratuita. ¿Me pueden compartir horarios y cómo reservo?"
);

// DATOS
// Reseñas reales copiadas de la ficha de Google del negocio (5.0, 421 opiniones).
// Actualizar cuando cambien en Google; no agregar testimonios inventados.
// Validar también el inventario de equipos y los textos comerciales.
document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-image]").forEach((image) => {
  const url = IMAGES[image.dataset.image];
  if (!url) return;

  image.addEventListener("error", () => {
    image.hidden = true;
    if (image.dataset.image === "technology") {
      document.getElementById("tech-orbit").hidden = false;
      document.getElementById("tech-art-label").hidden = false;
    }
  });

  if (!image.src) {
    image.src = url;
  }
  image.hidden = false;

  if (image.dataset.image === "technology") {
    document.getElementById("tech-orbit").hidden = true;
    document.getElementById("tech-art-label").hidden = true;
  }
});

if (IMAGES.logoOfficial) {
  document.querySelectorAll("[data-brand]").forEach((brand) => {
    const image = new Image();
    image.alt = "Monarca Estética Láser";
    image.className = "official-logo";
    image.addEventListener("load", () => brand.replaceChildren(image));
    image.src = IMAGES.logoOfficial;
  });
}

const encodedLocation = encodeURIComponent(MAP_QUERY);
document.getElementById("directions-link").href =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodedLocation;
document.getElementById("location-map").src =
  "https://www.google.com/maps?q=" + encodedLocation + "&output=embed";

// NAVEGACIÓN
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("main-nav");
const mobileQuery = window.matchMedia("(max-width: 900px)");

function setMenu(open, restoreFocus = false) {
  navigation.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");

  if (open) {
    document.documentElement.scrollTop = 0;
    navigation.querySelector("a").focus();
  }
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenu(false);
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});

document.querySelectorAll("[data-brand]").forEach((brand) => {
  brand.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (menuButton.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") setMenu(false, true);

  // Mantiene el foco en las opciones mientras el menú móvil cubre la página.
  if (event.key === "Tab") {
    const items = [...navigation.querySelectorAll("a"), menuButton];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

mobileQuery.addEventListener("change", () => setMenu(false));

// ANIMACIONES
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window) {
  if (!reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("reveal-ready");

      // Entrada escalonada: 50ms por posición dentro del mismo contenedor.
      const siblings = [...element.parentElement.children].filter((item) =>
        item.hasAttribute("data-reveal")
      );
      const position = siblings.indexOf(element);
      if (position > 0) {
        element.style.transitionDelay = Math.min(position * 50, 200) + "ms";
      }

      revealObserver.observe(element);
    });
  }

  const links = [...navigation.querySelectorAll("a")];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.getAttribute("href") === "#" + entry.target.id) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });

  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) sectionObserver.observe(section);
  });
}

// WHATSAPP
const whatsappReady = /^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER);
const toast = document.getElementById("toast");
let toastTimer;

function notify(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 5000);
}

// Cierre manual: tocar el aviso lo descarta de inmediato.
toast.addEventListener("click", () => {
  window.clearTimeout(toastTimer);
  toast.hidden = true;
});

function openWhatsApp(treatment = "") {
  if (!whatsappReady) {
    notify("WhatsApp está pendiente de configuración. Puedes contactar a Monarca desde el enlace de Instagram.");
    return;
  }

  const message = treatment
    ? encodeURIComponent(
      "Hola, me gustaría una valoración gratuita para conocer si el tratamiento de " +
      treatment + " es adecuado para mí."
    )
    : whatsappMessage;

  // Nueva pestaña: no afecta el ciclo de la página.
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + message, "_blank", "noopener");
}

document.querySelectorAll("[data-whatsapp]").forEach((button) => {
  button.addEventListener("click", () => {
    if (whatsappReady) openWhatsApp();
    else openBooking("");
  });
});

// SOLICITUD DE VALORACIÓN
const bookingDialog = document.getElementById("booking-dialog");
const treatmentSelect = document.getElementById("treatment-select");
const bookingStatus = document.getElementById("booking-status");
const bookingSubmit = document.getElementById("booking-submit");
const bookingInstagram = document.getElementById("booking-instagram");
let bookingTrigger = null;

function openBooking(treatment) {
  bookingTrigger = document.activeElement;
  setMenu(false);
  treatmentSelect.value = treatment || "";
  bookingStatus.hidden = whatsappReady;
  bookingSubmit.hidden = !whatsappReady;
  bookingInstagram.hidden = whatsappReady;

  if (!bookingDialog.open) bookingDialog.showModal();
}

document.querySelectorAll("[data-book]").forEach((button) => {
  button.addEventListener("click", () => openBooking(button.dataset.treatment));
});

document.querySelector(".dialog-close").addEventListener("click", () => bookingDialog.close());

bookingDialog.addEventListener("click", (event) => {
  const rect = bookingDialog.getBoundingClientRect();
  if (
    event.target === bookingDialog &&
    (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom)
  ) {
    bookingDialog.close();
  }
});

bookingDialog.addEventListener("close", () => {
  if (bookingTrigger && document.contains(bookingTrigger)) bookingTrigger.focus();
});

document.getElementById("booking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!whatsappReady) {
    notify("Agendamiento por WhatsApp pendiente de configuración.");
    return;
  }
  openWhatsApp(treatmentSelect.value);
});

// SLIDER 3D - Instagram (móvil)
(() => {
  const grid = document.querySelector(".social-placeholders");
  if (!grid || grid.children.length < 3) return;
  const items = [...grid.children];
  const sliderQuery = window.matchMedia("(max-width: 759px)");
  let active = 0;
  let timer = null;

  const apply = () => {
    items.forEach((item, index) => {
      const delta = (index - active + items.length) % items.length;
      item.classList.toggle("carousel-active", delta === 0);
      item.classList.toggle("carousel-right", delta === 1);
      item.classList.toggle("carousel-left", delta === items.length - 1);
    });
  };

  const next = () => {
    active = (active + 1) % items.length;
    apply();
  };

  const prev = () => {
    active = (active - 1 + items.length) % items.length;
    apply();
  };

  const start = () => {
    active = 0;
    grid.classList.add("carousel-3d");
    apply();
    if (!reducedMotion.matches) timer = setInterval(next, 3200);
  };

  const stop = () => {
    grid.classList.remove("carousel-3d");
    items.forEach((item) =>
      item.classList.remove("carousel-active", "carousel-right", "carousel-left")
    );
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  let startX = 0;
  grid.addEventListener(
    "touchstart",
    (event) => {
      startX = event.touches[0].clientX;
    },
    { passive: true }
  );
  grid.addEventListener(
    "touchend",
    (event) => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) < 40) return;
      if (delta < 0) next();
      else prev();
    },
    { passive: true }
  );

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("carousel-right")) next();
      else if (item.classList.contains("carousel-left")) prev();
    });
  });

  sliderQuery.addEventListener("change", () => {
    if (sliderQuery.matches) start();
    else stop();
  });
  if (sliderQuery.matches) start();
})();

// ACORDEONES SUAVES - Tecnología y Preguntas Frecuentes
(() => {
  if (reducedMotion.matches) return;
  const ease = "height .35s cubic-bezier(.22, .61, .36, 1), padding-bottom .35s cubic-bezier(.22, .61, .36, 1)";
  const closeEase = "height .3s ease, padding-bottom .3s ease";
  document.querySelectorAll(".tech-details details, .faq-item").forEach((details) => {
    const body = details.querySelector(":scope > p");
    if (!body) return;
    const naturalPadding = parseFloat(getComputedStyle(body).paddingBottom);

    const cleanup = (event) => {
      if (event.propertyName !== "height") return;
      body.style.height = "";
      body.style.paddingBottom = "";
      body.style.overflow = "";
      body.style.transition = "";
    };

    details.addEventListener("toggle", () => {
      body.addEventListener("transitionend", cleanup, { once: true });
      body.style.transition = details.open ? ease : closeEase;
      body.style.overflow = "hidden";
      if (details.open) {
        body.style.height = "0px";
        body.style.paddingBottom = "0px";
        requestAnimationFrame(() => {
          body.style.height = body.scrollHeight + "px";
          body.style.paddingBottom = naturalPadding + "px";
        });
      } else {
        body.style.height = body.scrollHeight + "px";
        body.style.paddingBottom = naturalPadding + "px";
        requestAnimationFrame(() => {
          body.style.height = "0px";
          body.style.paddingBottom = "0px";
        });
      }
    });
  });
})();
