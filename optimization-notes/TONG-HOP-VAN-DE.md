# 📋 TỔNG HỢP VẤN ĐỀ VÀ TỐI ƯU HÓA WEBSITE OVI GROUP

**Ngày tạo:** 28/11/2025  
**Người đánh giá:** AI Assistant  
**Trạng thái:** Chờ xử lý

---

## 🎯 MỨC ĐỘ ƯU TIÊN

- 🔴 **CAO**: Cần fix ngay lập tức (bảo mật, hiệu năng nghiêm trọng)
- 🟡 **TRUNG**: Nên fix trong tuần tới (UX, performance)
- 🟢 **THẤP**: Có thể làm sau (nice to have)

---

## 🔴 ƯU TIÊN CAO - CẦN FIX NGAY

### 1. 🔒 BẢO MẬT - JWT TOKEN BỊ LỘ (CRITICAL)

**File:** `assets/js/UI_data.js` (dòng 3), `assets/js/contact.js` (dòng 26)

**Vấn đề:**
```javascript
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyMzAwMDN9.RPI0R1UgVl3V4yuoXbm6I2H6xV8whs1DXy065i4kzXI";
```
JWT token bị lộ công khai trong source code, ai cũng có thể:
- Xem được token trong DevTools
- Dùng token để gọi API
- Có thể decode để xem thông tin user (kiennv)

**Giải pháp:**
1. **Ngắn hạn:** Tạo token mới và giới hạn quyền chỉ READ cho public endpoints
2. **Dài hạn:** 
   - Di chuyển authentication logic sang backend
   - Implement API key riêng cho public data
   - Hoặc cho phép public access không cần token cho data công khai

**File cần sửa:**
- `assets/js/UI_data.js`
- `assets/js/contact.js`

**Mức độ nguy hiểm:** ⚠️⚠️⚠️ NGHIÊM TRỌNG

---

### 2. 🎨 MÀU SẮC HEADER/FOOTER KHÔNG HỢP BRAND

**File:** `assets/css/main.css` (dòng 214, 618)

**Vấn đề:**
```css
.header .branding {
  background-color: #ceb7b7; /* Màu be nhạt không match brand */
}
.footer {
  background-color: #ceb7b7; /* Giống header, không đẹp */
}
```

**Giải pháp:**
```css
/* CÁCH 1: Sạch sẽ, chuyên nghiệp */
.header .branding {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.footer {
  background: linear-gradient(135deg, #841421 0%, #6b1016 100%);
  color: #ffffff;
}

/* CÁCH 2: Gradient hiện đại */
.header .branding {
  background: linear-gradient(90deg, #ffffff 0%, #f5f5f5 100%);
}

/* CÁCH 3: Dùng brand color cho header */
.header .branding {
  background: linear-gradient(90deg, #841421 0%, #9c1928 100%);
}
```

**Ảnh hưởng:** UX, Brand identity
**Thời gian fix:** 15 phút

---

### 3. 📱 VIDEO BACKGROUND TRÊN MOBILE (Performance Issue)

**File:** `index.html` (dòng 99-102), `assets/css/main.css`

**Vấn đề:**
- Video `background_fix.mp4` load trên mobile làm tốn data
- Có thể làm chậm trang đáng kể
- Không cần thiết trên màn hình nhỏ

**Giải pháp:**
```css
/* Thêm vào main.css */
@media (max-width: 768px) {
  .hero-video {
    display: none !important;
  }
  
  .hero {
    background: linear-gradient(135deg, #841421 0%, #6b1016 100%);
  }
}

/* Hoặc dùng poster image cho mobile */
@media (max-width: 768px) {
  .hero-video {
    poster: "assets/img/hero-bg.png";
    display: none;
  }
}
```

**Trong HTML:**
```html
<video autoplay muted loop playsinline preload="none" class="hero-video">
  <source src="assets/img/background_fix.mp4" type="video/mp4">
</video>
```

**Lợi ích:** Tăng tốc độ load 30-50% trên mobile

---

### 4. 🔍 SEO - THIẾU META TAGS QUAN TRỌNG

**File:** `index.html` (dòng 8-10)

**Vấn đề:**
```html
<meta name="description" content="">
<meta name="keywords" content="">
```
Meta tags trống → Google không index tốt

**Giải pháp:**
```html
<!-- SEO cơ bản -->
<meta name="description" content="OVI Technology JSC - Giải pháp chuyển đổi số doanh nghiệp, Hệ thống ERP Oracle, Tư vấn triển khai công nghệ cho doanh nghiệp Việt Nam">
<meta name="keywords" content="ERP, Oracle, chuyển đổi số, OVI Group, hệ thống quản trị doanh nghiệp, Oracle Cloud, công nghệ thông tin">
<meta name="author" content="OVI Technology JSC">

<!-- Open Graph cho Facebook/Social -->
<meta property="og:type" content="website">
<meta property="og:title" content="OVI Technology JSC - Giải pháp chuyển đổi số doanh nghiệp">
<meta property="og:description" content="Đối tác Oracle, Deloitte - Cung cấp giải pháp ERP và chuyển đổi số cho doanh nghiệp">
<meta property="og:image" content="https://ovigroup.vn/assets/img/fulllogo.png">
<meta property="og:url" content="https://ovigroup.vn">
<meta property="og:site_name" content="OVI Group">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="OVI Technology JSC">
<meta name="twitter:description" content="Giải pháp chuyển đổi số doanh nghiệp">
<meta name="twitter:image" content="https://ovigroup.vn/assets/img/fulllogo.png">

<!-- Structured Data (Schema.org) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OVI Technology JSC",
  "alternateName": "OVI Group",
  "url": "https://ovigroup.vn",
  "logo": "https://ovigroup.vn/assets/img/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-838481882",
    "contactType": "customer service",
    "email": "info@ovigroup.vn",
    "areaServed": "VN",
    "availableLanguage": ["vi", "en"]
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61582934707165"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "97 Tạ Hiện, Phường Bình Trưng Tây",
    "addressLocality": "Quận 2",
    "addressRegion": "TP. Hồ Chí Minh",
    "postalCode": "70000",
    "addressCountry": "VN"
  }
}
</script>
```

**Thời gian:** 20 phút

---

## 🟡 ƯU TIÊN TRUNG - NÊN FIX TUẦN NÀY

### 5. ⚡ TỐI ƯU HÓA HIỆU NĂNG

**File:** Multiple files

**Vấn đề:**
- Images không có lazy loading
- Video không optimize
- Không có compression
- Load nhiều libraries không cần thiết

**Giải pháp:**

**5.1. Lazy Loading Images:**
```html
<!-- Thêm loading="lazy" cho tất cả images -->
<img src="assets/img/clients/cadivi.png" 
     loading="lazy" 
     alt="Cadivi - Khách hàng OVI Group">
```

**5.2. Optimize Video:**
```bash
# Compress video bằng ffmpeg
ffmpeg -i background_fix.mp4 -vcodec h264 -acodec mp2 -b:v 1000k background_fix_compressed.mp4
```

**5.3. Preload Critical Resources:**
```html
<!-- Thêm vào <head> -->
<link rel="preload" href="assets/css/main.css" as="style">
<link rel="preload" href="assets/img/fulllogo.png" as="image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**5.4. Defer Non-Critical JS:**
```html
<!-- Translate script -->
<script defer type="text/javascript"
  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

<!-- Zalo chat -->
<script defer src="https://sp.zalo.me/plugins/sdk.js"></script>
```

---

### 6. 🐛 BUG TRONG TRANSLATE LOGIC

**File:** `assets/js/translate.js`

**Vấn đề:**
```javascript
// Dòng 98-99: Luôn force về VI
currentLanguage = "vi";
localStorage.setItem("selectedLanguage", "vi");

// Nhưng dòng 105 lại comment ra logic đọc từ localStorage
// currentLanguage = localStorage.getItem("selectedLanguage") || "vi";
```

**Giải pháp:**
```javascript
// Đọc từ localStorage hoặc default là "vi"
currentLanguage = localStorage.getItem("selectedLanguage") || "vi";
updateButtonText(currentLanguage);

// Chỉ force về VI nếu muốn reset khi reload (hiện tại logic này đúng nếu đó là requirement)
// Nếu muốn GIỮ ngôn ngữ người dùng đã chọn, thì bỏ 2 dòng force
```

**Quyết định:** Hỏi khách hàng xem có muốn giữ ngôn ngữ đã chọn không?

---

### 7. ✨ CẢI THIỆN UX

**7.1. Loading States cho API:**

**File:** `assets/js/UI_data.js`

**Thêm skeleton loader:**
```javascript
async function loadServices() {
  const container = document.getElementById("service-list");
  
  // Hiển thị skeleton loading
  container.innerHTML = `
    <div class="col-lg-4 col-md-6 skeleton-item">
      <div class="skeleton-box"></div>
    </div>
  `.repeat(6);
  
  try {
    const response = await fetch(API_URL_SERVICES, {
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    // ... render data
    
  } catch (error) {
    console.error("Lỗi:", error);
    container.innerHTML = `
      <div class="col-12 text-center error-state">
        <i class="bi bi-exclamation-circle" style="font-size: 48px; color: #dc3545;"></i>
        <p style="margin-top: 20px;">Không thể tải dữ liệu dịch vụ.</p>
        <button class="btn btn-primary" onclick="loadServices()">
          <i class="bi bi-arrow-clockwise"></i> Thử lại
        </button>
      </div>
    `;
  }
}
```

**CSS cho skeleton:**
```css
.skeleton-item {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-box {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  height: 300px;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**7.2. Toast Notifications:**
```javascript
// Thêm file mới: assets/js/toast.js
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

---

### 8. 📱 RESPONSIVE IMPROVEMENTS

**File:** `assets/css/main.css`

**Thêm breakpoints:**
```css
/* Tablet landscape */
@media (max-width: 991px) {
  .header .logo img {
    max-height: 55px;
  }
  
  .section-title p {
    font-size: 28px;
  }
}

/* Tablet portrait */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 36px;
    line-height: 44px;
  }
  
  .featured-services .service-item {
    padding: 30px 20px;
  }
  
  /* Stack products vertical */
  .products .product-box {
    min-height: 250px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .topbar {
    font-size: 12px;
  }
  
  .contact-info i a,
  .contact-info i span {
    font-size: 11px;
  }
  
  /* Hide some text on mobile */
  .topbar .contact-info .bi-phone span {
    display: none;
  }
  
  .topbar .contact-info .bi-phone::after {
    content: 'Gọi ngay';
  }
}
```

---

### 9. 🌐 CẢI THIỆN ĐA NGÔN NGỮ

**Vấn đề hiện tại:**
- Google Translate không tốt cho business content
- Dịch sai thuật ngữ chuyên ngành (ERP, CRM, etc.)
- UI dropdown đơn giản

**Giải pháp ngắn hạn:**
```javascript
// Thêm notranslate cho các thuật ngữ quan trọng
<span class="notranslate">ERP</span>
<span class="notranslate">Oracle Cloud</span>
<span class="notranslate">CRM</span>
```

**Giải pháp dài hạn (tương lai):**
- Migrate sang i18n thực sự với file json
- Thuê dịch thuật chuyên nghiệp
- Hỗ trợ thêm tiếng Trung, Nhật, Hàn cho B2B

---

## 🟢 ƯU TIÊN THẤP - CÓ THỂ LÀM SAU

### 10. 📊 ANALYTICS & TRACKING

**Thêm Google Analytics 4:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Tracking events:**
```javascript
// Track button clicks
document.querySelectorAll('.btn-get-started').forEach(btn => {
  btn.addEventListener('click', () => {
    gtag('event', 'click', {
      'event_category': 'CTA',
      'event_label': 'Get Started Button'
    });
  });
});

// Track form submission
form.addEventListener('submit', () => {
  gtag('event', 'form_submit', {
    'event_category': 'Contact',
    'event_label': 'Contact Form'
  });
});
```

---

### 11. ♿ ACCESSIBILITY (WCAG 2.1)

**Cải thiện:**
```html
<!-- Add aria labels -->
<button class="lang-btn" aria-label="Chọn ngôn ngữ">🌐 VN</button>

<!-- Skip to content -->
<a href="#main" class="skip-to-content">Bỏ qua đến nội dung chính</a>

<!-- Alt text đầy đủ -->
<img src="..." alt="Logo OVI Group - Công ty công nghệ chuyển đổi số">

<!-- Keyboard navigation -->
<a href="#services" class="btn-get-started" tabindex="0">Get Started</a>
```

**CSS cho skip link:**
```css
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
```

---

### 12. 🎨 UI/UX ENHANCEMENTS

**12.1. Loading bar khi chuyển trang:**
```javascript
// assets/js/main.js
window.addEventListener('beforeunload', () => {
  document.body.classList.add('loading');
});
```

**12.2. Smooth scroll với offset cho sticky header:**
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerOffset = 78;
    const elementPosition = target.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});
```

**12.3. Progress bar khi scroll:**
```html
<!-- Thêm vào HTML -->
<div class="progress-bar-container">
  <div class="progress-bar-fill"></div>
</div>
```

```css
.progress-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #f0f0f0;
  z-index: 9999;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #841421, #9c1928);
  width: 0%;
  transition: width 0.2s;
}
```

```javascript
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector('.progress-bar-fill').style.width = scrolled + '%';
});
```

---

### 13. 🔄 ERROR HANDLING & RETRY MECHANISM

**Thêm retry logic cho API calls:**
```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Sử dụng
async function loadServices() {
  try {
    const data = await fetchWithRetry(API_URL_SERVICES, {
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });
    // ... render data
  } catch (error) {
    showToast('Không thể tải dữ liệu. Vui lòng thử lại sau.', 'error');
  }
}
```

---

### 14. 🎭 ANIMATIONS & TRANSITIONS

**Thêm micro-interactions:**
```css
/* Button hover effects */
.btn-get-started {
  position: relative;
  overflow: hidden;
}

.btn-get-started::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-get-started:hover::before {
  width: 300px;
  height: 300px;
}

/* Card hover */
.service-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
```

---

### 15. 🌟 FUTURE FEATURES

**Có thể thêm sau:**

1. **Live Chat Widget** (Tawk.to hoặc Intercom)
2. **Blog Section** cho SEO
3. **Case Studies** - Success stories
4. **Newsletter Signup**
5. **Dark Mode Toggle**
6. **PWA Support** (Progressive Web App)
7. **Testimonials Slider** từ khách hàng
8. **Interactive Product Demo**
9. **Chatbot AI** hỗ trợ tự động
10. **Multi-currency Support** cho international clients

---

## 📁 CẤU TRÚC FILE CẦN THÊM/SỬA

### Cần tạo mới:
```
optimization-notes/
├── TONG-HOP-VAN-DE.md (file này)
├── SECURITY-FIX.md
├── PERFORMANCE-CHECKLIST.md
├── SEO-IMPROVEMENTS.md
└── code-samples/
    ├── toast-notification.js
    ├── skeleton-loader.html
    ├── retry-mechanism.js
    └── improved-responsive.css
```

### Cần sửa:
```
assets/
├── js/
│   ├── UI_data.js (fix token)
│   ├── contact.js (fix token)
│   ├── translate.js (fix logic bug)
│   └── main.js (thêm features)
├── css/
│   └── main.css (colors, responsive)
└── img/
    └── (optimize images)

index.html (meta tags, lazy loading)
```

---

## ✅ CHECKLIST TRIỂN KHAI

### Phase 1: Critical Fixes (1-2 ngày)
- [ ] Fix JWT token security issue
- [ ] Thay đổi màu header/footer
- [ ] Tắt video trên mobile
- [ ] Thêm meta tags SEO đầy đủ

### Phase 2: Performance (3-5 ngày)
- [ ] Lazy loading images
- [ ] Optimize video
- [ ] Defer non-critical scripts
- [ ] Compress assets

### Phase 3: UX Improvements (1 tuần)
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive fixes

### Phase 4: Advanced Features (2-4 tuần)
- [ ] Google Analytics
- [ ] Accessibility improvements
- [ ] Advanced animations
- [ ] i18n implementation

---

## 💰 ƯỚC TÍNH THỜI GIAN

| Task | Thời gian | Developer |
|------|-----------|-----------|
| Security fixes | 2 giờ | BE Dev |
| UI/Color changes | 1 giờ | FE Dev |
| Performance optimization | 4 giờ | FE Dev |
| SEO improvements | 2 giờ | FE Dev |
| UX enhancements | 8 giờ | FE Dev |
| Testing | 4 giờ | QA |
| **TỔNG** | **~3 ngày** | |

---

## 📞 LIÊN HỆ

Nếu có câu hỏi về bất kỳ vấn đề nào, vui lòng liên hệ:
- Tech Lead: TUHA
- Frontend: DUCNV
- Backend: KIENNV

---

**Lưu ý:** Tài liệu này được tạo tự động. Vui lòng review và cập nhật theo tình hình thực tế của dự án.

