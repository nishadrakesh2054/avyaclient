//service page

// --- Utility Functions ---
function extractPlainText(content) {
  if (!content || !content.root || !content.root.children) return "";
  const paragraph = content.root.children.find(
    (child) => child.type === "paragraph"
  );
  if (!paragraph || !paragraph.children) return "";
  return paragraph.children.map((c) => c.text).join("");
}

function truncateText(text, wordLimit = 10) {
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
}

function getParagraphs(content) {
  if (!content?.root?.children) return [];
  return content.root.children
    .filter((el) => el.type === "paragraph")
    .map((p) => p.children.map((c) => c.text).join(""))
    .filter((t) => t.length > 0);
}

// --- Main Logic ---
document.addEventListener("DOMContentLoaded", async () => {
  // --- Service List Page ---
  const BASE_URL='http://localhost:5000'

  const serviceListContainer = document.getElementById("service-list");
  if (serviceListContainer) {
    try {
      serviceListContainer.innerHTML =
        '<div class="loading">Loading services...</div>';
      const res = await fetch(`${BASE_URL}/api/services`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      serviceListContainer.innerHTML = "";
      if (!data.docs || !Array.isArray(data.docs) || data.docs.length === 0) {
        serviceListContainer.innerHTML =
          '<div class="error">No services found.</div>';
        return;
      }
      data.docs.forEach((service) => {
        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6";
        card.innerHTML = `
          <div class="service-card style2">
            <div class="service-card_icon">
              <img src="${BASE_URL}${service.icon?.url || ""}" alt="${
          service.icon?.alt || "icon"
        }">
            </div>
            <div class="service-card_content">
              <h4 class="service-card_title h5">
                <a href="service-details.html?id=${service.id}">${
          service.title
        }</a>
              </h4>
              <p class="service-card_text">
                ${
                  truncateText(extractPlainText(service.content), 10) ||
                  "No description"
                }
              </p>
              <a href="service-details.html?id=${
                service.id
              }" class="link-btn"><i class="fas fa-arrow-right"></i> Read More</a>
            </div>
          </div>
        `;
        serviceListContainer.appendChild(card);
      });
    } catch (err) {
      serviceListContainer.innerHTML =
        '<div class="error">Failed to load services.</div>';
      console.error("Failed to load services:", err);
    }
  }

  // --- Service Details Page ---
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get("id");
  if (serviceId) {
    const titleEl = document.querySelector(".page-title");
    const imageEl = document.querySelector(".page-img img");
    const contentContainer = document.querySelector(".page-content");
    const checklistContainer = document.querySelector(".service-page-list ul");
    if (!titleEl || !imageEl || !contentContainer || !checklistContainer)
      return;
    try {
      titleEl.textContent = "Loading...";
      const res = await fetch(
        `${BASE_URL}/api/services/${serviceId}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const service = await res.json();
      if (!service) throw new Error("Service not found");
      // Populate title
      titleEl.textContent = service.title;
      // Populate image
      if (service.image?.url) {
        imageEl.src = `${BASE_URL}${service.image.url}`;
        imageEl.alt = service.image.alt || service.title;
      }
      // Populate content
      const paragraphs = getParagraphs(service.content);
      const existingPs = contentContainer.querySelectorAll("p");
      existingPs.forEach((el) => el.remove());
      if (paragraphs.length) {
        paragraphs.forEach((p) => {
          const para = document.createElement("p");
          para.classList.add("mb-30");
          para.textContent = p;
          contentContainer.insertBefore(
            para,
            contentContainer.querySelector(".page-subtitle")
          );
        });
      }
      // Populate checklist
      if (Array.isArray(service.checklist)) {
        checklistContainer.innerHTML = "";
        service.checklist.forEach((item) => {
          const li = document.createElement("li");
          li.innerHTML = `<i class="far fa-check-circle"></i> ${item.item}`;
          checklistContainer.appendChild(li);
        });
      }
    } catch (err) {
      titleEl.textContent = "Failed to load service details.";
      console.error("Failed to fetch service details:", err);
    }
  }
});
