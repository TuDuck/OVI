# ⚡ PERFORMANCE OPTIMIZATION CHECKLIST

## 📊 HIỆN TRẠNG

### Vấn đề phát hiện:
- ❌ Video background ~5-10MB load trên mobile
- ❌ Images không có lazy loading
- ❌ Không có image optimization
- ❌ Load nhiều fonts không cần thiết
- ❌ Google Translate blocking render
- ❌ Không có compression

---

## ✅ CHECKLIST TỐI ƯU

### 1. VIDEO OPTIMIZATION

**Hiện tại:**
```html
<video autoplay muted loop playsinline class="hero-video">
  <source src="assets/img/background_fix.mp4" type="video/mp4">
</video>
```

**Cần làm:**

#### 1.1. Tắt video trên mobile
```css
/* Thêm vào assets/css/main.css */
@media (max-width: 768px) {
  .hero-video {
    display: none !important;
  }
  
  .hero {
    background: linear-gradient(135deg, #841421 0%, #6b1016 100%);
  }
}
```

#### 1.2. Optimize video file
```bash
# Compress video
ffmpeg -i assets/img/background_fix.mp4 \
  -vcodec h264 \
  -crf 28 \
  -preset medium \
  -vf scale=1920:-1 \
  -movflags +faststart \
  assets/img/background_fix_optimized.mp4

# Tạo fallback image
ffmpeg -i assets/img/background_fix.mp4 \
  -ss 00:00:01 \
  -vframes 1 \
  assets/img/hero-bg-fallback.jpg
```

#### 1.3. Add poster và preload
```html
<video 
  autoplay 
  muted 
  loop 
  playsinline 
  preload="none"
  poster="assets/img/hero-bg-fallback.jpg"
  class="hero-video">
  <source src="assets/img/background_fix_optimized.mp4" type="video/mp4">
</video>
```

- [ ] Compress video file
- [ ] Add mobile fallback
- [ ] Add poster image
- [ ] Change preload to "none"

---

### 2. IMAGE OPTIMIZATION

**Files cần optimize:**
```
assets/img/
├── clients/ (43 files)
├── icon/ (27 files)
├── team/ (5 files)
└── Stats/ (3 files)
```

#### 2.1. Lazy Loading
```html
<!-- Thêm loading="lazy" cho TẤT CẢ images trừ hero -->
<img src="assets/img/clients/cadivi.png" 
     loading="lazy" 
     alt="Cadivi - Khách hàng OVI Group">
```

**Files cần sửa:**
- [ ] index.html - clients section
- [ ] index.html - stats section
- [ ] index.html - team section
- [ ] assets/js/UI_data.js - dynamic images

#### 2.2. Optimize Images
```bash
# Install image optimizer
npm install -g sharp-cli

# Optimize PNGs
for file in assets/img/clients/*.png; do
  sharp -i "$file" -o "${file%.png}_opt.png" resize 200 200 --fit cover
done

# Convert to WebP
for file in assets/img/**/*.png; do
  sharp -i "$file" -o "${file%.png}.webp" --quality 85
done
```

#### 2.3. Responsive Images
```html
<picture>
  <source 
    srcset="assets/img/fulllogo.webp" 
    type="image/webp">
  <source 
    srcset="assets/img/fulllogo.png" 
    type="image/png">
  <img 
    src="assets/img/fulllogo.png" 
    alt="OVI Group Logo"
    loading="lazy">
</picture>
```

**Checklist:**
- [ ] Add lazy loading to all images
- [ ] Optimize all PNGs (compress)
- [ ] Convert important images to WebP
- [ ] Use responsive images with srcset
- [ ] Add proper alt text

---

### 3. FONT OPTIMIZATION

**Hiện tại:**
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
```

**Vấn đề:** Load quá nhiều font weights (27 variants!)

**Tối ưu:**
```html
<!-- Chỉ load weights thực sự dùng -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">

<!-- Hoặc preconnect để load nhanh hơn -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Checklist:**
- [ ] Audit font weights đang dùng
- [ ] Reduce số lượng font variants
- [ ] Add preconnect
- [ ] Consider self-hosting fonts

---

### 4. JAVASCRIPT OPTIMIZATION

#### 4.1. Defer Non-Critical Scripts
```html
<!-- Google Translate - defer -->
<script defer type="text/javascript"
  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

<!-- Zalo Chat - defer -->
<script defer src="https://sp.zalo.me/plugins/sdk.js"></script>

<!-- Analytics - defer -->
<script defer src="assets/vendor/purecounter/purecounter_vanilla.js"></script>
```

#### 4.2. Critical Scripts - Preload
```html
<link rel="preload" href="assets/js/main.js" as="script">
<link rel="preload" href="assets/js/UI_data.js" as="script">
```

#### 4.3. Remove Unused Libraries
**Audit các vendor scripts:**
```
vendor/
├── chartjs/ (có dùng không?)
├── circle-progress/ (có dùng không?)
├── countdown/ (có dùng không?)
├── counter-up/ (có dùng không?)
```

**Checklist:**
- [ ] Defer non-critical scripts
- [ ] Preload critical scripts
- [ ] Remove unused libraries
- [ ] Minify custom JS files

---

### 5. CSS OPTIMIZATION

#### 5.1. Critical CSS
**Extract critical CSS cho above-the-fold:**
```bash
# Install
npm install -g critical

# Generate critical CSS
critical index.html --base . --inline > index-critical.html
```

#### 5.2. Remove Unused CSS
```bash
# Install PurgeCSS
npm install -g purgecss

# Remove unused styles
purgecss --css assets/css/*.css --content index.html --output assets/css/
```

#### 5.3. Minify CSS
```bash
# Minify
npx clean-css-cli -o assets/css/main.min.css assets/css/main.css
```

**Checklist:**
- [ ] Extract and inline critical CSS
- [ ] Remove unused CSS
- [ ] Minify CSS files
- [ ] Use CSS instead of JS where possible

---

### 6. PRELOAD & PREFETCH

**Add to `<head>`:**
```html
<!-- Preload critical resources -->
<link rel="preload" href="assets/css/main.css" as="style">
<link rel="preload" href="assets/img/fulllogo.png" as="image">
<link rel="preload" href="assets/js/main.js" as="script">

<!-- Prefetch next page resources -->
<link rel="prefetch" href="service-details.html">

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//14.225.71.26">
<link rel="dns-prefetch" href="//translate.google.com">
```

**Checklist:**
- [ ] Add preload for critical resources
- [ ] Add dns-prefetch for external domains
- [ ] Consider prefetch for likely next pages

---

### 7. CACHING STRATEGY

#### 7.1. Service Worker (PWA)
**Tạo file: `sw.js`**
```javascript
const CACHE_NAME = 'ovi-v1';
const urlsToCache = [
  '/',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/img/fulllogo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

#### 7.2. HTTP Cache Headers
**Nginx/Apache config:**
```nginx
# Nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Checklist:**
- [ ] Implement service worker
- [ ] Configure server cache headers
- [ ] Add manifest.json for PWA

---

### 8. COMPRESSION

#### 8.1. Enable Gzip/Brotli
**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;

brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml;
```

#### 8.2. Minify HTML
```bash
npm install -g html-minifier

html-minifier --collapse-whitespace \
              --remove-comments \
              --minify-css true \
              --minify-js true \
              index.html -o index.min.html
```

**Checklist:**
- [ ] Enable Gzip compression
- [ ] Enable Brotli (if supported)
- [ ] Minify HTML files

---

### 9. THIRD-PARTY OPTIMIZATION

#### 9.1. Google Translate
```javascript
// Load only when user clicks language selector
let translateLoaded = false;

document.querySelector('.lang-btn').addEventListener('click', () => {
  if (!translateLoaded) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
    translateLoaded = true;
  }
});
```

#### 9.2. Zalo Chat - Lazy Load
```javascript
// Load Zalo chat after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    const script = document.createElement('script');
    script.src = 'https://sp.zalo.me/plugins/sdk.js';
    document.body.appendChild(script);
  }, 3000);
});
```

**Checklist:**
- [ ] Lazy load Google Translate
- [ ] Lazy load Zalo chat
- [ ] Defer Facebook SDK

---

### 10. DATABASE & API OPTIMIZATION

#### 10.1. API Response Caching
```javascript
// Cache API responses in localStorage
async function loadServices() {
  const cacheKey = 'services_cache';
  const cacheTime = 1000 * 60 * 30; // 30 minutes
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheTime) {
      renderServices(data);
      return;
    }
  }
  
  try {
    const response = await fetch(API_URL_SERVICES);
    const data = await response.json();
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    renderServices(data);
  } catch (error) {
    console.error(error);
  }
}
```

#### 10.2. Backend Optimization
```java
// Add caching in Spring Boot
@Cacheable("services")
@GetMapping("/api/services")
public List<Service> getServices() {
    return serviceRepository.findAll();
}

// Add pagination
@GetMapping("/api/services")
public Page<Service> getServices(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    return serviceRepository.findAll(PageRequest.of(page, size));
}
```

**Checklist:**
- [ ] Add API response caching (localStorage)
- [ ] Implement backend caching
- [ ] Add pagination if needed
- [ ] Optimize database queries

---

## 🎯 TESTING

### Tools cần dùng:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/
4. **Lighthouse** (Chrome DevTools)

### Metrics cần đạt:
- Performance Score: > 90
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

---

## 📊 TRACKING PROGRESS

| Task | Status | Priority | Time | Assignee |
|------|--------|----------|------|----------|
| Video optimization | ⏳ | 🔴 High | 1h | FE |
| Image lazy loading | ⏳ | 🔴 High | 2h | FE |
| Font optimization | ⏳ | 🟡 Med | 30m | FE |
| JS defer/async | ⏳ | 🟡 Med | 1h | FE |
| CSS optimization | ⏳ | 🟢 Low | 2h | FE |
| Caching strategy | ⏳ | 🟡 Med | 3h | BE+FE |
| Compression | ⏳ | 🟡 Med | 30m | DevOps |
| API caching | ⏳ | 🟢 Low | 2h | BE |

**Total estimated time:** ~12 hours (~2 days)

---

## 📈 EXPECTED RESULTS

### Before:
- Load Time: 4-6s
- Page Size: 8-12MB
- Performance Score: 60-70

### After:
- Load Time: 1.5-2.5s
- Page Size: 2-4MB
- Performance Score: 90+

**Improvement:** ~60-70% faster! 🚀

