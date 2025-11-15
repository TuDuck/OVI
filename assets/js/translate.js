
// ===============================
// Config & State
// ===============================
let currentLanguage = "vi";
let googleReady = false;
let isSwitching = false;
let translateCount = Number(sessionStorage.getItem("translateCount") || 0);

function debugLog(msg, lang = "") {
  translateCount++;
  sessionStorage.setItem("translateCount", translateCount);
  console.log(
    `%c[DEBUG] #${translateCount} - ${msg} ${lang ? "→ ngôn ngữ: " + lang.toUpperCase() : ""}`,
    "color: #0f0; font-weight: bold;"
  );
}

// ===============================
// FORCE VI COOKIE trước khi Google Translate load
// ===============================
document.cookie = "googtrans=/vi/vi; path=/;";
document.cookie = "googtrans=/vi/vi; path=/; domain=" + location.hostname;

// ===============================
// INIT GOOGLE TRANSLATE
// ===============================
function googleTranslateElementInit() {
  try {
    new google.translate.TranslateElement({
      pageLanguage: "vi",
      includedLanguages: "vi,en",
      autoDisplay: false,
    }, "google_translate_element");

    googleReady = true;
    debugLog("Google Translate loaded, forced language VI");
  } catch (e) {
    console.error(e);
  }
}

// ===============================
// CHANGE LANGUAGE (Dropdown)
// ===============================
function changeLanguage(lang) {
  if (!googleReady || isSwitching || lang === currentLanguage) return;

  isSwitching = true;
  currentLanguage = lang;
  localStorage.setItem("selectedLanguage", lang);

  const select = document.querySelector("select.goog-te-combo");
  if (!select) {
    debugLog("Không tìm thấy combo, retry sau 100ms", lang);
    setTimeout(() => changeLanguage(lang), 100);
    return;
  }

  if (select.value !== lang) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
    debugLog("Trigger translation completed", lang);
  }

  setTimeout(() => {
    isSwitching = false;
  }, 800);

  updateButtonText(lang);
}

// ===============================
// UPDATE BUTTON
// ===============================
function updateButtonText(lang) {
  const btn = document.querySelector(".lang-btn");
  if (!btn) return;

  if (lang === "vi") {
    btn.innerHTML = '<img src="assets/img/flags/vietnam.png" class="flag-icon"> VN';
  } else if (lang === "en") {
    btn.innerHTML = '<img src="assets/img/flags/united-states.png" class="flag-icon"> EN';
  }
}

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".language-dropdown");
  if (!dropdown) return;

  const btn = dropdown.querySelector(".lang-btn");
  const menu = dropdown.querySelector(".lang-menu");

  // Luôn đặt ngôn ngữ về VI khi reload
  currentLanguage = "vi";
  localStorage.setItem("selectedLanguage", "vi");

  // Cập nhật UI nút về VN ngay lập tức
  updateButtonText("vi");

  // // Cập nhật button theo localStorage
  // currentLanguage = localStorage.getItem("selectedLanguage") || "vi";
  // updateButtonText(currentLanguage);

  // Toggle menu
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
    menu.style.display = dropdown.classList.contains("open") ? "block" : "none";
  });

  // Chọn ngôn ngữ
  menu.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      const lang = li.getAttribute("data-lang");
      dropdown.classList.remove("open");
      menu.style.display = "none";
      changeLanguage(lang);
    });
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
    menu.style.display = "none";
  });

  // Ẩn banner Google Translate
  const st = document.createElement("style");
  st.textContent = `
    .goog-te-banner-frame, .goog-te-balloon-frame, .skiptranslate, .goog-te-gadget { display:none !important; }
    body { top:0 !important; }
  `;
  document.head.appendChild(st);

  debugLog("DOM loaded, current language", currentLanguage);
});

