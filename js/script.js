// Burger menu: use delegation so it works on every page and can't be broken by load order
document.addEventListener("click", function (event) {
  if (event.target.closest && event.target.closest(".icon-menu")) {
    event.preventDefault();
    event.stopPropagation();
    document.body.classList.toggle("menu-open");
  }
});

// Dropdown menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const dropdownLinks = document.querySelectorAll(".menu__item_dropdown > .menu__link");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const isMobileNav =
        window.innerWidth <= 767.99 || document.body.classList.contains("menu-open");
      if (!isMobileNav) {
        return;
      }

      const clickedLabel = e.target.closest(".menu__link-label");
      if (clickedLabel) {
        document.body.classList.remove("menu-open");
        document.querySelectorAll(".menu__item_dropdown").forEach((item) => {
          item.classList.remove("active");
        });
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const parentItem = this.closest(".menu__item_dropdown");
      const isActive = parentItem.classList.contains("active");

      if (window.innerWidth <= 767.99) {
        document.querySelectorAll(".menu__item_dropdown").forEach((item) => {
          if (item !== parentItem) {
            item.classList.remove("active");
          }
        });
      }

      if (isActive) {
        parentItem.classList.remove("active");
      } else {
        parentItem.classList.add("active");
      }
    });
  });

  // Close dropdown when clicking on a dropdown link
  const dropdownMenuLinks = document.querySelectorAll(".menu__dropdown-link");
  dropdownMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      document.querySelectorAll(".menu__item_dropdown").forEach((item) => {
        item.classList.remove("active");
      });
      // Close mobile menu if open
      if (window.innerWidth <= 767.99) {
        document.body.classList.remove("menu-open");
      }
    });
  });
});

// Hero slideshows (Industries page, Home page)
function initHeroSlideshow(rootId, slideSelector, intervalMs) {
  var root = document.getElementById(rootId);
  if (!root) return;
  var slides = root.querySelectorAll(slideSelector);
  if (slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var i = 0;
  setInterval(function () {
    slides[i].classList.remove("is-active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-active");
  }, intervalMs);
}

document.addEventListener("DOMContentLoaded", function () {
  initHeroSlideshow("industriesHeroSlides", ".main_industries-slide", 5500);
  initHeroSlideshow("homeHeroSlides", ".main_home-slide", 5500);
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("contactFormStatus");
  const submitBtn = document.getElementById("contactFormSubmit");
  const ajaxUrl = "https://formsubmit.co/ajax/ivanmoreno71669@gmail.com";
  const successMessage =
    "Thank you for submitting. We will get back to you as soon as possible.";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const products = Array.from(
      form.querySelectorAll('input[name="products[]"]:checked')
    ).map(function (cb) {
      return cb.value;
    });

    const countryCode = form.querySelector("#country-code").value;
    const phone = form.querySelector("#phone").value.trim();

    const payload = {
      _captcha: "false",
      name: form.querySelector("#name").value.trim(),
      email: form.querySelector("#email").value.trim(),
      phone: countryCode + " " + phone,
      company: form.querySelector("#company").value.trim(),
      products: products.length ? products.join(", ") : "None selected",
      message: form.querySelector("#comments").value.trim(),
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    if (statusEl) {
      statusEl.hidden = true;
      statusEl.className = "contact-form__status";
    }

    fetch(ajaxUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.data.message || "Submission failed");
        }

        form.classList.add("is-submitted");

        if (statusEl) {
          statusEl.textContent = successMessage;
          statusEl.className = "contact-form__status contact-form__status--success";
          statusEl.hidden = false;
        }
      })
      .catch(function () {
        if (statusEl) {
          statusEl.textContent =
            "Something went wrong. Please try again or email us directly at info@garlast.com.";
          statusEl.className = "contact-form__status contact-form__status--error";
          statusEl.hidden = false;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send";
        }
      });
  });
}

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});
