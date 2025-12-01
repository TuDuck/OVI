# 🔧 TROUBLESHOOTING - XỬ LÝ SỰ CỐ - XÓA CACHE TOKEN

## ⚠️ VẤN ĐỀ: "Vẫn truy cập được admin khi dùng token cũ"

### Nguyên nhân:
- Token được lưu trong **localStorage** của browser
- localStorage tồn tại theo **origin** (domain + port)
- Token cũ vẫn còn → auth-guard cho phép truy cập

### Origins khác nhau:
- `http://localhost:8081` ≠ `http://127.0.0.1:5500` ≠ `http://localhost:5500`
- Mỗi origin có localStorage riêng

---

## 🚀 GIẢI PHÁP (Chọn 1 trong các cách sau)

### ✅ **Cách 1: Dùng Clear Cache Page (Nhanh nhất)**

1. Truy cập: `http://127.0.0.1:5500/admin/clear-cache.html`
2. Click nút "Clear Token & Reload"
3. Xong!

**Hoặc thêm vào bookmark để dùng sau này:**
```
http://127.0.0.1:5500/admin/clear-cache.html
```

---

### ✅ **Cách 2: Dùng Browser DevTools**

**Chrome/Edge:**
1. Mở trang admin: `http://127.0.0.1:5500/admin/`
2. Nhấn `F12` (hoặc `Ctrl+Shift+I`)
3. Chọn tab **Console**
4. Paste và Enter:
```javascript
localStorage.clear(); location.reload();
```

**Hoặc xem trước khi xóa:**
```javascript
console.log("Current token:", localStorage.getItem("token"));
localStorage.removeItem("token");
location.reload();
```

---

### ✅ **Cách 3: Dùng Application/Storage Tab**

1. Mở DevTools (`F12`)
2. Chọn tab **Application** (Chrome) hoặc **Storage** (Firefox)
3. Sidebar: **Local Storage** → `http://127.0.0.1:5500`
4. Tìm key `token` → Click chuột phải → **Delete**
5. Reload page (`F5`)

---

### ✅ **Cách 4: Dùng Incognito/Private Mode**

**Chrome/Edge:**
- `Ctrl + Shift + N` (Windows/Linux)
- `Cmd + Shift + N` (Mac)

**Firefox:**
- `Ctrl + Shift + P`

**Lợi ích:**
- ✅ Không có localStorage cũ
- ✅ Không cache
- ✅ Test từ đầu

---

### ✅ **Cách 5: Clear Browser Cache Hoàn Toàn**

**Chrome/Edge:**
1. `Ctrl + Shift + Delete`
2. Chọn:
   - ✅ Cookies and other site data
   - ✅ Cached images and files
3. Time range: **All time**
4. Click **Clear data**

---

## 🔍 KIỂM TRA TOKEN HIỆN TẠI

### Xem token trong Console:
```javascript
// Xem token
console.log("Token:", localStorage.getItem("token"));

// Parse token để xem thông tin
function decodeToken(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const token = localStorage.getItem("token");
const decoded = decodeToken(token);
console.log("Token info:", decoded);
console.log("Username:", decoded?.sub);
console.log("Issued at:", new Date(decoded?.iat * 1000));
console.log("Expires at:", decoded?.exp ? new Date(decoded.exp * 1000) : "No expiry");
```

---

## 🐛 CÁC VẤN ĐỀ THƯỜNG GẶP

### 1. "Token không hợp lệ" sau khi login

**Nguyên nhân:**
- Token bị lỗi khi lưu vào localStorage
- Token từ API không đúng format

**Giải pháp:**
```javascript
// Check token response từ API
const response = await fetch("/api/login", {...});
const data = await response.json();
console.log("Token from API:", data.token);

// Verify token format (phải có 3 phần: header.payload.signature)
const parts = data.token.split('.');
console.log("Token parts:", parts.length); // Phải = 3
```

---

### 2. "Token hết hạn ngay sau khi login"

**Nguyên nhân:**
- Token có `exp` (expiration) quá ngắn
- Thời gian server không đồng bộ

**Giải pháp:**
```javascript
// Check token expiry
const token = localStorage.getItem("token");
const decoded = decodeToken(token);
const now = Math.floor(Date.now() / 1000);
const timeLeft = decoded.exp - now;

console.log("Token expires at:", new Date(decoded.exp * 1000));
console.log("Time left (seconds):", timeLeft);
console.log("Time left (hours):", Math.floor(timeLeft / 3600));
```

**Fix Backend:** Tăng token expiry
```java
// Spring Boot JWT
.setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
```

---

### 3. "Vẫn redirect về login dù có token"

**Nguyên nhân:**
- auth-guard.js load trước login.js
- AuthHelper chưa khả dụng

**Giải pháp:**
Check thứ tự scripts trong HTML:
```html
<body>
    <!-- ✅ ĐÚNG: login.js load trước -->
    <script src="../assets/javarscript/login.js"></script>
    <script src="js/auth-guard.js"></script>
    
    <!-- ❌ SAI: Ngược lại -->
    <!-- <script src="js/auth-guard.js"></script> -->
    <!-- <script src="../assets/javarscript/login.js"></script> -->
</body>
```

---

### 4. "Console báo lỗi CORS khi gọi API"

**Vấn đề:**
```
Access to fetch at 'http://26.129.206.142:8080/api/...' 
from origin 'http://127.0.0.1:5500' has been blocked by CORS policy
```

**Giải pháp Backend:**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5500",
                        "http://127.0.0.1:5500",
                        "http://localhost:8081"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 🎯 BEST PRACTICES

### 1. Development vs Production Tokens

**Development:**
- Token expiry: 24 hours hoặc longer
- Dễ test, không phải login liên tục

**Production:**
- Token expiry: 1-2 hours
- Implement refresh token
- Better security

---

### 2. Debug Mode

Thêm vào `auth-guard.js`:
```javascript
const DEBUG = true; // Set false in production

if (DEBUG) {
    console.log("🔍 Auth Debug:");
    console.log("- Token:", localStorage.getItem("token")?.substring(0, 20) + "...");
    console.log("- Origin:", window.location.origin);
    console.log("- Path:", window.location.pathname);
}
```

---

### 3. Logout Trên Tất Cả Tabs

```javascript
// Thêm vào auth-guard.js
window.addEventListener('storage', (e) => {
    if (e.key === 'token' && !e.newValue) {
        // Token bị xóa ở tab khác → logout tab này
        alert("Bạn đã đăng xuất ở tab khác!");
        window.location.href = "/admin/login.html";
    }
});
```

---

## 📞 EMERGENCY: Force Logout Tất Cả Users

**Run trên Console:**
```javascript
// Clear ALL storage
localStorage.clear();
sessionStorage.clear();

// Clear cookies
document.cookie.split(";").forEach(c => {
    document.cookie = c.replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Reload
location.reload();
```

---

## ✅ CHECKLIST TROUBLESHOOTING

Khi gặp vấn đề, check theo thứ tự:

- [ ] Token có tồn tại? `localStorage.getItem("token")`
- [ ] Token format đúng? (3 parts: xxx.yyy.zzz)
- [ ] Token hết hạn chưa? Check `exp` field
- [ ] Scripts load đúng thứ tự? (login.js → auth-guard.js)
- [ ] Origin đúng không? (localhost vs 127.0.0.1)
- [ ] Browser cache? Clear và thử lại
- [ ] CORS error? Check backend config
- [ ] Console có errors? Fix từng lỗi

---

**Cập nhật:** 28/11/2025  
**Version:** 1.0

