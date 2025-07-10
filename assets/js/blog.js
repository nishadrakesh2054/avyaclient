// --- Utility Functions ---
function formatDateDisplay(input) {
  if (!input) return "";
  if (/^\d{1,2} [A-Za-z]+, \d{4}$/.test(input.trim())) {
    return input;
  }
  const dateObj = new Date(input);
  if (isNaN(dateObj)) return input;
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();
  return `${day} ${month}, ${year}`;
}
const BASE_URL='http://localhost:5000'
// --- Main Logic ---
document.addEventListener("DOMContentLoaded", async () => {
  // --- Blog List/Page Logic ---
  const API_URL = `${BASE_URL}/api/blogs`;
  const blogsContainer = document.getElementById("main-blogs");
  const recentContainer = document.getElementById("recent-posts");
  const categoriesContainer = document.getElementById("categories-list");
  const paginationContainer = document.getElementById("pagination");
  const POSTS_PER_PAGE = 2;
  let currentPage = 1;

  // Only run blog list logic if blogsContainer exists
  if (blogsContainer) {
    // Show loading state
    blogsContainer.innerHTML = '<div class="loading">Loading blogs...</div>';
    if (recentContainer)
      recentContainer.innerHTML =
        '<div class="loading">Loading recent posts...</div>';
    if (categoriesContainer)
      categoriesContainer.innerHTML =
        '<div class="loading">Loading categories...</div>';

    async function fetchBlogs(page = 1) {
      try {
        const res = await fetch(
          `${API_URL}?page=${page}&limit=${POSTS_PER_PAGE}&sort=-createdAt`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        renderBlogs(data.docs);
        renderPagination(data.totalPages, data.page);
      } catch (err) {
        blogsContainer.innerHTML =
          '<div class="error">Failed to load blogs.</div>';
        if (paginationContainer) paginationContainer.innerHTML = "";
        console.error("Failed to load blogs:", err);
      }
    }

    async function fetchRecentPosts() {
      if (!recentContainer) return;
      try {
        const res = await fetch(`${API_URL}?limit=3&sort=-createdAt`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        renderRecentPosts(data.docs);
      } catch (err) {
        recentContainer.innerHTML =
          '<div class="error">Failed to load recent posts.</div>';
        console.error("Failed to load recent posts:", err);
      }
    }

    async function fetchAllCategories() {
      if (!categoriesContainer) return;
      try {
        const res = await fetch(`${API_URL}?limit=100&sort=-createdAt`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        renderCategories(data.docs);
      } catch (err) {
        categoriesContainer.innerHTML =
          '<div class="error">Failed to load categories.</div>';
        console.error("Failed to load categories:", err);
      }
    }

    function renderBlogs(blogs) {
      if (!blogs || blogs.length === 0) {
        blogsContainer.innerHTML = '<div class="error">No blogs found.</div>';
        return;
      }
      const fragment = document.createDocumentFragment();
      blogs.forEach((blog) => {
        const imageUrl = blog.image?.url
        ? `${BASE_URL}${blog.image.url}`
        : "assets/img/default.jpg";
        const contentText =
          blog.content?.root?.children[0]?.children[0]?.text || "";
        const date = formatDateDisplay(blog.date);
        const div = document.createElement("div");
        div.className = "blog-card style4 mb-4";
        div.innerHTML = `
          <div class="blog-img">
            <img src="${imageUrl}" alt="${blog.image?.alt || "Blog"}" />
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <a href="#"><i class="far fa-calendar"></i> ${date}</a>
              <a href="#"><i class="far fa-user"></i> Post by: Admin</a>
              <a href="#"><i class="far fa-clock"></i> Read Time: ${
                blog.readTime
              } Min</a>
            </div>
            <h3 class="blog-title">
              <a href="blog-details.html?id=${blog.id}">${blog.title}</a>
            </h3>
            <p>${contentText.substring(0, 200)}...</p>
            <a href="blog-details.html?id=${blog.id}" class="link-btn style2">
              <i class="fas fa-arrow-right"></i> READ MORE
            </a>
          </div>
        `;
        fragment.appendChild(div);
      });
      blogsContainer.innerHTML = "";
      blogsContainer.appendChild(fragment);
    }

    function renderRecentPosts(blogs) {
      if (!blogs || blogs.length === 0) {
        recentContainer.innerHTML =
          '<div class="error">No recent posts found.</div>';
        return;
      }
      const fragment = document.createDocumentFragment();
      blogs.forEach((blog) => {
        const imageUrl = blog.image?.url
          ? `${BASE_URL}${blog.image.url}`
          : "assets/img/default.jpg";
        const date = formatDateDisplay(blog.date);
        const div = document.createElement("div");
        div.className = "recent-post";
        div.innerHTML = `
          <div class="media-img">
            <a href="blog-details.html?id=${blog.id}">
              <img src="${imageUrl}" alt="${blog.image?.alt || "Recent"}" />
            </a>
          </div>
          <div class="media-body">
            <h4 class="post-title">
              <a class="text-inherit" href="blog-details.html?id=${blog.id}">
                ${blog.title}
              </a>
            </h4>
            <div class="recent-post-meta">
              <a href="#">${date}</a>
            </div>
          </div>
        `;
        fragment.appendChild(div);
      });
      recentContainer.innerHTML = "";
      recentContainer.appendChild(fragment);
    }

    function renderCategories(blogs) {
      const categories = [...new Set(blogs.map((blog) => blog.category))];
      if (!categories || categories.length === 0) {
        categoriesContainer.innerHTML =
          '<div class="error">No categories found.</div>';
        return;
      }
      const fragment = document.createDocumentFragment();
      categories.forEach((cat) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <a href="category-blog.html?category=${encodeURIComponent(cat)}">
            <i class="fa-solid fa-arrow-right"></i> ${cat}
          </a>
        `;
        fragment.appendChild(li);
      });
      categoriesContainer.innerHTML = "";
      categoriesContainer.appendChild(fragment);
    }

    function renderPagination(totalPages, currentPage) {
      if (!paginationContainer) return;
      let html = "<ul>";
      if (currentPage > 1) {
        html += `<li><a href="#" data-page="${
          currentPage - 1
        }"><i class="fas fa-arrow-left"></i></a></li>`;
      }
      for (let i = 1; i <= totalPages; i++) {
        html += `<li><a href="#" data-page="${i}" class="${
          i === currentPage ? "active" : ""
        }">${i}</a></li>`;
      }
      if (currentPage < totalPages) {
        html += `<li><a href="#" data-page="${
          currentPage + 1
        }"><i class="fas fa-arrow-right"></i></a></li>`;
      }
      html += "</ul>";
      paginationContainer.innerHTML = html;
      paginationContainer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const page = parseInt(e.target.dataset.page);
          if (!isNaN(page)) {
            currentPage = page;
            fetchBlogs(page);
          }
        });
      });
    }

    // Initial Load
    fetchBlogs(currentPage);
    fetchRecentPosts();
    fetchAllCategories();
  }

  // --- Blog Details/Single Page Logic ---
  const blogId = new URLSearchParams(window.location.search).get("id");
  const blogThumb = document.querySelector(".blog-thumb img");
  const blogMeta = document.querySelector(".blog-meta");
  const blogTitle = document.querySelector(".blog-title");
  const blogContent = document.querySelector(".blog-content");
  const blogParagraphs = document.getElementById("blog-paragraphs");

  if (
    blogId &&
    blogThumb &&
    blogMeta &&
    blogTitle &&
    blogContent &&
    blogParagraphs
  ) {
    blogContent.classList.add("loading");
    blogParagraphs.innerHTML = '<div class="loading">Loading blog...</div>';
    try {
      const res = await fetch(`${BASE_URL}/api/blogs/${blogId}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const imageUrl = data.image?.url
        ? `${BASE_URL}${data.image.url}`
        : "assets/img/default.jpg";
      const date = formatDateDisplay(data.date);
      const title = data.title;
      const readTime = data.readTime;
      const contentBlocks = data.content?.root?.children || [];
      const contentHTML = contentBlocks
        .map((block) =>
          block.children.map((child) => `<p>${child.text}</p>`).join("")
        )
        .join("");
      blogThumb.src = imageUrl;
      blogThumb.alt = data.image?.alt || "Blog Image";
      blogMeta.innerHTML = `
        <small href="#" class='me-4'><i class="far fa-calendar px-2"></i> ${date}</small>
        <small href="#"><i class="far fa-clock px-2"></i>ReadTime :${readTime} MIN</small>
      `;
      blogTitle.innerText = title;
      blogParagraphs.innerHTML = contentHTML;
      blogContent.classList.remove("loading");
    } catch (err) {
      blogParagraphs.innerHTML = "<p>Failed to load blog content.</p>";
      blogContent.classList.remove("loading");
      console.error(err);
    }
  } else if (blogContent && blogId === null) {
    blogContent.innerHTML = "<p>Blog ID not found in URL.</p>";
  }
});
