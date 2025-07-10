document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL='http://localhost:5000'
  const API_URL = `${BASE_URL}/api/blog`;
  const blogsContainer = document.getElementById("category-blogs");
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");

  // Format the date
  function formatDateDisplay(input) {
    const dateObj = new Date(input);
    if (isNaN(dateObj)) return input;
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  // Render blogs in two-column layout
  function renderBlogs(blogs) {
    if (!blogs.length) {
      blogsContainer.innerHTML = `<p>No blogs found in "${selectedCategory}" category.</p>`;
      return;
    }

    blogsContainer.innerHTML = blogs
      .map((blog) => {
        const imageUrl = blog.image?.url
          ? `${BASE_URL}${blog.image.url}`
          : "assets/img/default.jpg";
        const contentText =
          blog.content?.root?.children[0]?.children[0]?.text || "";
        const date = formatDateDisplay(blog.date);

        return `
            <div class="row mb-5">
              <div class="col-xxl-12 col-lg-12">
                <div class="row align-items-start g-4">
                  <!-- Left side: Blog text -->
                  <div class="col-lg-7 col-md-12">
                    <div class="blog-content">
                      <div class="blog-meta ">
                        <small class='pe-2'><i class="far fa-calendar"></i> ${date}</small>
                        <small class='px-2'><i class="far fa-user"></i> Post by: Admin</small>
                        <small class='ps-2' ><i class="far fa-clock"></i> Read Time: ${
                          blog.readTime
                        } Min</small>
                      </div>
                      <h2 class="blog-title">
                        <a href="blog-details.html?id=${blog.id}">${
          blog.title
        }</a>
                      </h2>
                      <p>${contentText.substring(0, 200)}...</p>
                      <a href="blog-details.html?id=${
                        blog.id
                      }" class="link-btn style2">
                        <i class="fas fa-arrow-right"></i> READ MORE
                      </a>
                    </div>
                  </div>
  
                  <!-- Right side: Blog image -->
                  <div class="col-lg-5 col-md-12">
                    <div class="blog-thumb text-center">
                      <a href="blog-details.html?id=${blog.id}">
                        <img src="${imageUrl}" alt="${
          blog.image?.alt || "Blog"
        }" class="img-fluid" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
      })
      .join("");
  }

  // Fetch blogs by category
  function fetchCategoryBlogs(category) {
    fetch(
      `${API_URL}?limit=100&sort=-createdAt&where[category][equals]=${encodeURIComponent(
        category
      )}`
    )
      .then((res) => res.json())
      .then((data) => renderBlogs(data.docs))
      .catch((err) => {
        console.error("Failed to load category blogs:", err);
        blogsContainer.innerHTML = `<p>Error loading blogs. Please try again later.</p>`;
      });
  }

  // Initial load
  if (selectedCategory) {
    fetchCategoryBlogs(selectedCategory);
  } else {
    blogsContainer.innerHTML = `<p>Please provide a valid category in URL like <code>?category=Meditation%20Class</code></p>`;
  }
});
