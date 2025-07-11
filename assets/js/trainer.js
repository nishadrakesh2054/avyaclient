document.addEventListener("DOMContentLoaded", () => {
  Promise.allSettled([fetchTrainers(), fetchFeedbacks()]).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Data fetch failed:", result.reason);
      }
    });
  });

  // ========== Trainers ==========
  async function fetchTrainers() {
    const container = document.querySelector(".team-slider-1");
    if (!container) return;
    // const BASE_URL = "http://localhost:5000";
    const BASE_URL = "https://avyabackend.onrender.com";

    try {
      const res = await fetch(`${BASE_URL}/api/trainers`);
      const data = await res.json();

      const fragment = document.createDocumentFragment();
      data.docs.forEach((trainer) => {
        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6";
        card.innerHTML = `
            <div class="team-card">
              <div class="team-card_img">
                <img src="${BASE_URL}${trainer.img.url}" alt="${
          trainer.img.alt || trainer.name
        }" />
              </div>
              <div class="team-card_content">
                <h4 class="team-card_title"><a href="team-details.html">${
                  trainer.name
                }</a></h4>
                <span class="team-card_desig">${trainer.Profession}</span>
              </div>
            </div>
          `;
        fragment.appendChild(card);
      });

      container.innerHTML = ""; // Clear existing
      container.appendChild(fragment);

      refreshSlick(container, {
        slidesToShow: 4,
        centerMode: true,
        arrows: false,
        dots: false,
        autoplay: true,
        autoplaySpeed: 1000,
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: 3 } },
          { breakpoint: 992, settings: { slidesToShow: 2 } },
          { breakpoint: 576, settings: { slidesToShow: 1 } },
        ],
      });
    } catch (err) {
      console.error("Failed to load trainers:", err);
    }
  }

  // ========== Feedbacks ==========
  async function fetchFeedbacks() {
    const container = document.querySelector(".testi-slider-1");
    if (!container) return;
    // const BASE_URL = "http://localhost:5000";
    const BASE_URL = "https://avyabackend.onrender.com";


    try {
      const res = await fetch(`${BASE_URL}/api/feedbacks`);
      const data = await res.json();

      const fragment = document.createDocumentFragment();
      data.docs.forEach((item) => {
        const card = document.createElement("div");
        card.className = "col-lg-6";
        card.innerHTML = `
            <div class="testi-box">
              <div class="testi-box_thumb">
                <img src="${BASE_URL}${item.image.url}" alt="${
          item.image.alt || item.name
        }" />
                <div class="block-quote"><i class="fas fa-quote-right text-info"></i></div>
                <div class="testi-box_profile mt-2">
                  <h4 class="testi-box_name">${item.name}</h4>
                  <span class="testi-box_desig">${item.profession}</span>
                </div>
              </div>
              <div class="testi-box_content">
                <p class="testi-box_text">${item.feedback}</p>
                <div class="rating">${generateStars(item.rating)}</div>
              </div>
            </div>
          `;
        fragment.appendChild(card);
      });

      container.innerHTML = "";
      container.appendChild(fragment);

      refreshSlick(container, {
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        dots: false,
        //   prevArrow: '<button type="button" class="slick-prev"><i class="far fa-arrow-left"></i></button>',
        //   nextArrow: '<button type="button" class="slick-next"><i class="far fa-arrow-right"></i></button>',
      });
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
    }
  }

  // ========== Helpers ==========
  function generateStars(rating = 5) {
    return Array.from(
      { length: 5 },
      (_, i) =>
        `<i class="fas fa-star ${i < rating ? "text-info" : "text-muted"}"></i>`
    ).join("");
  }

  function refreshSlick(element, settings) {
    const $el = $(element);
    if ($el.hasClass("slick-initialized")) {
      $el.slick("unslick");
    }
    $el.slick(settings);
  }
});
