// js/faq.js
// --- Utility Functions ---
function initBackgrounds() {
  document.querySelectorAll("[data-bg-src]").forEach((el) => {
    el.style.backgroundImage = `url('${el.getAttribute("data-bg-src")}')`;
  });
}

// --- Main Logic ---
document.addEventListener("DOMContentLoaded", async () => {
  // --- FAQ Section ---
  const BASE_URL = "http://localhost:5000";

  const faqContainer = document.getElementById("faqAccordion");
  if (faqContainer) {
    try {
      faqContainer.innerHTML = '<div class="loading">Loading FAQs...</div>';
      const res = await fetch(`${BASE_URL}/api/faqs`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      faqContainer.innerHTML = "";
      if (!data.docs || !Array.isArray(data.docs) || data.docs.length === 0) {
        faqContainer.innerHTML = '<div class="error">No FAQs found.</div>';
      } else {
        const fragment = document.createDocumentFragment();
        data.docs.forEach((faq, index) => {
          const collapseId = `collapse-${index + 1}`;
          const headerId = `collapse-item-${index + 1}`;
          const isActive = index === 0 ? "show" : "";
          const isExpanded = index === 0 ? "true" : "false";
          const isCollapsed = index === 0 ? "" : "collapsed";
          const parentId = "faqAccordion";
          const accordionItem = document.createElement("div");
          accordionItem.className = `accordion-card ${
            isActive ? "active" : ""
          }`;
          accordionItem.innerHTML = `
            <div class="accordion-header" id="${headerId}">
              <button
                class="accordion-button ${isCollapsed}"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#${collapseId}"
                aria-expanded="${isExpanded}"
                aria-controls="${collapseId}"
              >
                ${faq.question}
              </button>
            </div>
            <div
              id="${collapseId}"
              class="accordion-collapse collapse ${isActive}"
              aria-labelledby="${headerId}"
              data-bs-parent="#${parentId}"
            >
              <div class="accordion-body">
                <p class="faq-text">${faq.answer}</p>
              </div>
            </div>
          `;
          fragment.appendChild(accordionItem);
        });
        faqContainer.appendChild(fragment);
      }
    } catch (err) {
      faqContainer.innerHTML = '<div class="error">Failed to load FAQs.</div>';
      console.error("Failed to load FAQs:", err);
    }
  }

  // --- Counters Section ---
  const counterRow = document.querySelector(".counter-area-1 .row");
  if (counterRow) {
    try {
      counterRow.innerHTML = '<div class="loading">Loading counters...</div>';
      const res = await fetch(`${BASE_URL}/api/counters`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      counterRow.innerHTML = "";
      const iconList = [
        "counter-icon_1-1.svg",
        "counter-icon_1-2.svg",
        "counter-icon_1-3.svg",
        "counter-icon_1-4.svg",
      ];
      if (!data.docs || !Array.isArray(data.docs) || data.docs.length === 0) {
        counterRow.innerHTML = '<div class="error">No counters found.</div>';
      } else {
        const fragment = document.createDocumentFragment();
        data.docs.forEach((item, index) => {
          const card = document.createElement("div");
          card.className = "col-sm-6 col-xl-auto";
          const value = item.progress;
          const showK = value < 100;
          card.innerHTML = `
            <div class="counter-card">
              <div class="counter-card_icon">
                <img src="assets/img/icon/${
                  iconList[index % iconList.length]
                }" alt="icon" />
              </div>
              <div class="media-body">
                <h2 class="counter-card_number">
                  <span class="counter-number">${value}</span>${
            showK ? "K" : ""
          }
                </h2>
                <p class="counter-card_text">${item.title}</p>
              </div>
            </div>
          `;
          fragment.appendChild(card);
        });
        counterRow.appendChild(fragment);
        // Counter up animation (if jQuery and counterUp are available)
        if (window.$ && typeof $(".counter-number").counterUp === "function") {
          $(".counter-number").counterUp({
            delay: 10,
            time: 2000,
          });
        }
      }
    } catch (err) {
      counterRow.innerHTML =
        '<div class="error">Failed to load counters.</div>';
      console.error("Failed to load counters:", err);
    }
  }

  // --- Banners Section ---
  const sliderContainer = document.getElementById("heroSlider1");
  if (sliderContainer) {
    try {
      sliderContainer.innerHTML =
        '<div class="loading">Loading banners...</div>';
      const res = await fetch(`${BASE_URL}/api/banners`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      sliderContainer.innerHTML = "";
      if (!data.docs || !Array.isArray(data.docs) || data.docs.length === 0) {
        sliderContainer.innerHTML =
          '<div class="error">No banners found.</div>';
      } else {
        const fragment = document.createDocumentFragment();
        data.docs.forEach((banner) => {
          const slide = document.createElement("div");
          slide.className = "hero-slider";
          slide.setAttribute("data-bg-src", `${BASE_URL}${banner.image.url}`);
          slide.innerHTML = `
            <div class="container">
              <div class="row">
                <div class="col-xl-6 col-lg-7 col-md-9">
                  <div class="hero-style1">
                    <span class="hero-subtitle" data-ani="slideinup" data-ani-delay="0s">
                      Welcome To Our Avya Club
                    </span>
                    <h1 class="hero-title text-white" data-ani="slideinup" data-ani-delay="0.1s">
                      ${banner.title.replace(
                        /(Swimming|positive |Fitness|wellness)/gi,
                        "<span>$1</span>"
                      )}
                    </h1>
                    <div class="btn-group" data-ani="slideinup" data-ani-delay="0.2s">
                      <a href="contact.html" class="btn style2">Join Us Now !</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          fragment.appendChild(slide);
        });
        sliderContainer.appendChild(fragment);
        // Manually trigger background image setting and slick reinitialization (if needed)
        initBackgrounds();
        if (window.$ && typeof $().slick === "function") {
          $("#heroSlider1").slick("unslick"); // Remove previous instance
          $("#heroSlider1").slick({
            fade: true,
            arrows: true,
            slidesToShow: 1,
            prevArrow: '[data-slick-prev="#heroSlider1"]',
            nextArrow: '[data-slick-next="#heroSlider1"]',
          });
        }
      }
    } catch (err) {
      sliderContainer.innerHTML =
        '<div class="error">Failed to load banners.</div>';
      console.error("Failed to load banners:", err);
    }
  }
});
