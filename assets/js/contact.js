document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".php-email-form");
  const loading = document.querySelector(".loading");
  const errorMessage = document.querySelector(".error-message");
  const sentMessage = document.querySelector(".sent-message");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Reset trạng thái cũ
    loading.style.display = "block";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";

    // Lấy dữ liệu từ form
    const name = document.getElementById("name-field").value;
    const phone = document.getElementById("email-field").value;
    const email = document.getElementById("subject-field").value;
    const message = document.getElementById("message-field").value;

    try {
      const response = await fetch("http://26.129.206.142:8080/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.API_TOKEN}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          message: message
        })
      });

      if (response.ok) {
        loading.style.display = "none";
        sentMessage.style.display = "block";
        form.reset();
      } else {
        const err = await response.json();
        throw new Error(err.message || "Gửi thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      loading.style.display = "none";
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    }
  });
});
