

document.addEventListener("DOMContentLoaded", function () {
  // Utility: Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Utility: Create toast container if it doesn't exist
  function ensureToastContainer() {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "10px";
      document.body.appendChild(container);
    }
    return container;
  }

  // Utility: Show toast
  function showToast(type, message) {
    const container = ensureToastContainer();
    const toast = document.createElement("div");

    toast.textContent = message;
    toast.style.padding = "12px 16px";
    toast.style.borderRadius = "4px";
    toast.style.color = "#fff";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    toast.style.backgroundColor = type === "success" ? "#28a745" : "#dc3545";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";

    container.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
  }

  // Generic form submit handler
  function handleFormSubmit({ formId, endpoint, transformData, validate }) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const formData = transformData(form);

      // Run validation
      const validationError = validate(formData);
      if (validationError) {
        showToast("error", validationError);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to send message");
          return res.json();
        })
        .then((data) => {
          showToast("success", "Message sent successfully!");
          form.reset();
        })
        .catch((err) => {
          console.error(err);
          showToast("error", "Something went wrong. Please try again.");
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }
const BASE_URL='http://localhost:5000'
  // Contact form
  handleFormSubmit({
    formId: "contact-form",
    endpoint: `${BASE_URL}/api/contacts`,
    transformData: (form) => ({
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      subject: form.subject.value.trim(),
      message: form.querySelector("textarea").value.trim(),
    }),
    validate: ({ name, email, phone, subject, message }) => {
      if (!name || !email || !phone || !subject || !message) {
        return "Please fill in all fields.";
      }
      if (!isValidEmail(email)) {
        return "Please enter a valid email address.";
      }
      return null;
    },
  });

  // Newsletter form
  handleFormSubmit({
    formId: "newsletter-form",
    endpoint: `${BASE_URL}/api/newsletter`,
    transformData: (form) => ({
      email: form.email.value.trim(),
    }),
    validate: ({ email }) => {
      if (!email) return "Please enter your email address.";
      if (!isValidEmail(email)) return "Invalid email format.";
      return null;
    },
  });
});
