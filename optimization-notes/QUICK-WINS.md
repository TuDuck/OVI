# ⚡ QUICK WINS - TỐI ƯU NHANH (< 30 PHÚT MỖI TASK)

Những thay đổi nhỏ nhưng có impact lớn, có thể làm ngay hôm nay.

---

## 1️⃣ THÊM LAZY LOADING (5 phút)

**File:** `index.html`

**Tìm tất cả `<img>` tags và thêm `loading="lazy"`:**

```html
<!-- BEFORE -->
<img src="assets/img/clients/cadivi.png" class="img-fluid" alt="">

<!-- AFTER -->
<img src="assets/img/clients/cadivi.png" class="img-fluid" alt="Cadivi" loading="lazy">
```

**Lợi ích:** Giảm 40-60% thời gian load ban đầu

---

## 2️⃣ TẮT VIDEO TRÊN MOBILE (10 phút)

**File:** `assets/css/main.css`

**Thêm vào cuối file:**

```css
/* ===== MOBILE VIDEO OPTIMIZATION ===== */
@media (max-width: 768px) {
  .hero-video {
    display: none !important;
  }
  
  .hero {
    background: linear-gradient(135deg, #841421 0%, #6b1016 100%);
  }
}
```

**Lợi ích:** Tiết kiệm 5-10MB data cho mobile users

---

## 3️⃣ THÊM META TAGS SEO (10 phút)

**File:** `index.html`

**Thay thế các meta tags trống:**

```html
<!-- OLD -->
<meta name="description" content="">
<meta name="keywords" content="">

<!-- NEW -->
<meta name="description" content="OVI Technology JSC - Giải pháp chuyển đổi số doanh nghiệp, Hệ thống ERP Oracle, Đối tác Deloitte. Hotline: +84 838481882">
<meta name="keywords" content="ERP, Oracle, chuyển đổi số, OVI Group, hệ thống quản trị doanh nghiệp, Oracle Cloud">

<!-- THÊM Open Graph -->
<meta property="og:title" content="OVI Technology JSC - Giải pháp chuyển đổi số">
<meta property="og:description" content="Đối tác Oracle, Deloitte - Cung cấp giải pháp ERP cho doanh nghiệp">
<meta property="og:image" content="https://ovigroup.vn/assets/img/fulllogo.png">
<meta property="og:url" content="https://ovigroup.vn">
```

**Lợi ích:** SEO tốt hơn, hiển thị đẹp khi share lên Facebook

---

## 4️⃣ DEFER GOOGLE TRANSLATE (5 phút)

**File:** `index.html` (dòng 809-810)

**BEFORE:**
```html
<script type="text/javascript"
  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

**AFTER:**
```html
<script defer type="text/javascript"
  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

**Lợi ích:** Không block page render

---

## 5️⃣ FIX MÀU HEADER (5 phút)

**File:** `assets/css/main.css` (dòng 214)

**BEFORE:**
```css
.header .branding {
  background-color: #ceb7b7;
}
```

**AFTER (chọn 1):**
```css
/* OPTION 1: Trắng sạch (Khuyến nghị) */
.header .branding {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

/* OPTION 2: Gradient nhẹ */
.header .branding {
  background: linear-gradient(90deg, #ffffff 0%, #f8f8f8 100%);
}
```

**Lợi ích:** Professional, đồng bộ brand

---

## 6️⃣ FIX MÀU FOOTER (5 phút)

**File:** `assets/css/main.css` (dòng 618)

**BEFORE:**
```css
.footer {
  background-color: #ceb7b7;
}
```

**AFTER:**
```css
.footer {
  background: linear-gradient(135deg, #841421 0%, #6b1016 100%);
}

.footer h4,
.footer p,
.footer ul li p {
  color: #ffffff;
}
```

**Lợi ích:** Đẹp hơn, nổi bật hơn

---

## 7️⃣ PRECONNECT FONTS (3 phút)

**File:** `index.html`

**Thêm TRƯỚC thẻ `<link>` font:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
```

**Lợi ích:** Load fonts nhanh hơn 200-300ms

---

## 8️⃣ OPTIMIZE FONT WEIGHTS (5 phút)

**File:** `index.html` (dòng 19-21)

**BEFORE:**
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
```

**AFTER (chỉ load weights thực sự dùng):**
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
```

**Lợi ích:** Giảm 70% kích thước font files

---

## 9️⃣ ADD ALT TEXT CHO IMAGES (10 phút)

**File:** `index.html`

**Tìm tất cả `alt=""` và điền nội dung:**

```html
<!-- BEFORE -->
<img src="assets/img/clients/cadivi.png" class="img-fluid" alt="">

<!-- AFTER -->
<img src="assets/img/clients/cadivi.png" class="img-fluid" alt="Cadivi - Khách hàng của OVI Group" loading="lazy">
```

**Các alt text gợi ý:**
- Logo: "Logo OVI Group - Công ty công nghệ chuyển đổi số"
- Icons: "Icon [tên dịch vụ]"
- Clients: "[Tên công ty] - Khách hàng OVI Group"
- Team: "[Tên] - [Chức vụ] OVI Group"

**Lợi ích:** SEO, Accessibility

---

## 🔟 VIDEO PRELOAD="NONE" (2 phút)

**File:** `index.html` (dòng 99)

**BEFORE:**
```html
<video autoplay muted loop playsinline class="hero-video">
```

**AFTER:**
```html
<video autoplay muted loop playsinline preload="none" class="hero-video">
```

**Lợi ích:** Video không load cho đến khi cần thiết

---

## 1️⃣1️⃣ ADD LOADING STATE (15 phút)

**File:** `assets/js/UI_data.js`

**Thêm skeleton loading:**

```javascript
async function loadServices() {
  const container = document.getElementById("service-list");
  
  // Show loading
  container.innerHTML = `
    <div class="col-12 text-center">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Đang tải dữ liệu...</p>
    </div>
  `;
  
  try {
    const response = await fetch(API_URL_SERVICES, {
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    // ... render data
    
  } catch (error) {
    container.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger">❌ Không thể tải dữ liệu</p>
        <button class="btn btn-primary" onclick="loadServices()">Thử lại</button>
      </div>
    `;
  }
}
```

**Lợi ích:** Better UX, người dùng biết đang loading

---

## 1️⃣2️⃣ COMPRESS CSS (10 phút)

**Run command:**

```bash
# Install
npm install -g clean-css-cli

# Compress
cleancss -o assets/css/main.min.css assets/css/main.css

# Update HTML
# <link href="assets/css/main.min.css" rel="stylesheet">
```

**Lợi ích:** Giảm 30-40% kích thước CSS

---

## 1️⃣3️⃣ RESPONSIVE LOGO (5 phút)

**File:** `assets/css/main.css`

**Thêm:**

```css
/* Responsive logo */
@media (max-width: 768px) {
  .header .logo img {
    max-height: 50px !important;
  }
}

@media (max-width: 576px) {
  .header .logo img {
    max-height: 45px !important;
  }
}
```

**Lợi ích:** Logo không quá to trên mobile

---

## 1️⃣4️⃣ HERO TEXT SHADOW (3 phút)

**File:** `assets/css/main.css` (thêm vào .hero h1)

```css
.hero h1 {
  margin: 0;
  font-size: 48px;
  font-weight: 600;
  line-height: 56px;
  color: var(--nav-dropdown-background-color);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5); /* ADD THIS */
}
```

**Lợi ích:** Text dễ đọc hơn trên video background

---

## 1️⃣5️⃣ SMOOTH SCROLL (5 phút)

**File:** `assets/js/main.js`

**Thêm vào cuối file:**

```javascript
// Smooth scroll with offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 78;
      const elementPosition = target.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  });
});
```

**Lợi ích:** Navigation mượt mà hơn

---

## ✅ SUMMARY CHECKLIST

Copy paste và check ✅:

```
[ ] 1. Thêm loading="lazy" cho images
[ ] 2. Tắt video trên mobile
[ ] 3. Thêm meta tags SEO
[ ] 4. Defer Google Translate
[ ] 5. Fix màu header
[ ] 6. Fix màu footer
[ ] 7. Preconnect fonts
[ ] 8. Optimize font weights
[ ] 9. Add alt text
[ ] 10. Video preload="none"
[ ] 11. Add loading states
[ ] 12. Compress CSS
[ ] 13. Responsive logo
[ ] 14. Hero text shadow
[ ] 15. Smooth scroll
```

---

## 🎯 KẾT QUẢ MONG ĐỢI

**Thời gian:** < 2 giờ để làm TẤT CẢ  
**Performance gain:** +20-30 điểm Lighthouse score  
**Visual improvement:** Đẹp hơn rõ rệt  
**User experience:** Mượt mà hơn nhiều  

---

**Priority:** 🟢 Làm ngay hôm nay!  
**Effort:** Low (< 2h total)  
**Impact:** High 🚀

