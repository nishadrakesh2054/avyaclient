document.addEventListener("DOMContentLoaded", () => {
//   const BASE_URL = "https://avyabackend.onrender.com";
//   const BASE_URL = "http://localhost:5000";
let BASE_URL;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  BASE_URL = "http://localhost:5000"; // Local backend
} else {
  BASE_URL = "https://avyabackend.onrender.com"; // Production backend
}

  const API_URL = `${BASE_URL}/api/photos`;
  const galleryGrid = document.getElementById("gallery-grid");
  const pagination = document.getElementById("pagination");
  const filterButtons = document.querySelectorAll(".filter-menu-active button");

  const IMAGES_PER_PAGE = 4;
  let allImages = [];
  let filteredImages = [];
  let currentPage = 1;

  function fetchImages() {
    fetch(`${API_URL}?limit=100&sort=-createdAt`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        allImages = data.docs || [];
        filteredImages = allImages;
        renderGallery();
        renderPagination();
      })
      .catch((err) => {
        console.error("Image loading failed:", err);
        // Show error message in gallery
        galleryGrid.innerHTML = `
          <div class="col-12 text-center">
            <div style="padding: 50px 20px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff6b6b; margin-bottom: 20px;"></i>
              <h4 style="color: #666;">Failed to Load Images</h4>
              <p style="color: #999;">Unable to load images from the server. Please try again later.</p>
            </div>
          </div>
        `;
        pagination.innerHTML = "";
      });
  }
  console.log("images", fetchImages);

  function renderGallery() {
    galleryGrid.innerHTML = "";

    // Check if there are any images to display
    if (filteredImages.length === 0) {
      const noImagesDiv = document.createElement("div");
      noImagesDiv.className = "col-12 text-center";
      noImagesDiv.innerHTML = `
        <div style="padding: 50px 20px;">
          <i class="fas fa-images" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
          <h4 style="color: #666;">No Images Found</h4>
          <p style="color: #999;">There are no images available in this category.</p>
        </div>
      `;
      galleryGrid.appendChild(noImagesDiv);
      return;
    }

    const start = (currentPage - 1) * IMAGES_PER_PAGE;
    const selected = filteredImages.slice(start, start + IMAGES_PER_PAGE);
    selected.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-md-6";
      const thumb = document.createElement("div");
      thumb.className = "portfolio-thumb";
      const anchor = document.createElement("a");
      anchor.className = "popup-image icon-btn";
      const imageUrl = `${BASE_URL}${item.photo.url}`;
      console.log("Image URL:", imageUrl, "Item:", item);
      anchor.href = imageUrl;
      anchor.innerHTML = '<i class="far fa-eye"></i>';
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = item.photo.alt || "Gallery";
      img.className = "img-fluid";
      thumb.appendChild(anchor);
      thumb.appendChild(img);
      col.appendChild(thumb);
      galleryGrid.appendChild(col);
    });
    // Re-initialize Magnific Popup for new elements
    if (window.$ && $.fn.magnificPopup) {
      $(".portfolio-area .popup-image").magnificPopup({
        type: "image",
        mainClass: "mfp-zoom-in",
        removalDelay: 260,
        gallery: { enabled: true },
      });
    }
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.innerText = i;
      if (i === currentPage) li.classList.add("active");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderGallery();
        renderPagination();
      });
      li.appendChild(a);
      pagination.appendChild(li);
    }
    if (currentPage < totalPages) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.innerHTML = `<i class="fas fa-arrow-right"></i>`;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage++;
        renderGallery();
        renderPagination();
      });
      li.appendChild(a);
      pagination.appendChild(li);
    }
  }

  function applyFilter(category) {
    currentPage = 1;
    if (category === "ALL") {
      filteredImages = allImages;
    } else {
      filteredImages = allImages.filter(
        (img) => img.category.toLowerCase() === category.toLowerCase()
      );
    }
    renderGallery();
    renderPagination();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector(".filter-menu-active .active")
        ?.classList.remove("active");
      btn.classList.add("active");
      const selected = btn.getAttribute("data-filter");
      applyFilter(selected);
    });
  });

  fetchImages();
});
