# 🔐 HƯỚNG DẪN SỬ DỤNG AuthHelper

## ✅ ĐÃ HOÀN THÀNH

### Files đã sửa:
1. ✅ `assets/javarscript/login.js` - Thêm AuthHelper và tích hợp với login
2. ✅ `assets/js/UI_data.js` - Dùng AuthHelper thay vì token cứng
3. ✅ `assets/js/contact.js` - Dùng AuthHelper thay vì token cứng
4. ✅ `index.html` - Load login.js để AuthHelper khả dụng globally

---

## 🎯 CÁCH HOẠT ĐỘNG

### 1. Login Flow
```javascript
// User login tại /admin/login.html
// Token được lưu tự động vào localStorage
AuthHelper.setToken(data.token);

// Thông tin user được parse từ JWT
const userInfo = AuthHelper.getUserInfo();
// => { username: "kiennv", issuedAt: Date, expiresAt: Date }
```

### 2. API Calls (Các file khác)
```javascript
// File: assets/js/UI_data.js, contact.js, etc.

// Lấy headers với token tự động
const headers = window.AuthHelper.getAuthHeaders();
// => {
//   "Content-Type": "application/json",
//   "Authorization": "Bearer <token_from_localStorage>"
// }

// Dùng trong fetch
const response = await fetch(API_URL, { headers });
```

### 3. Token tự động refresh khi user login lại
- Mỗi lần login thành công, token mới được lưu
- Token cũ tự động bị thay thế

---

## 📚 CÁC FUNCTIONS CÓ SẴN

### `AuthHelper.getToken()`
```javascript
const token = AuthHelper.getToken();
// => "eyJhbGciOiJIUzI1NiJ9..." hoặc null
```

### `AuthHelper.setToken(token)`
```javascript
AuthHelper.setToken("new_token_here");
// Lưu token vào localStorage
```

### `AuthHelper.removeToken()`
```javascript
AuthHelper.removeToken();
// Xóa token khỏi localStorage
```

### `AuthHelper.isAuthenticated()`
```javascript
if (AuthHelper.isAuthenticated()) {
  console.log("User đã login");
} else {
  console.log("User chưa login hoặc token hết hạn");
}
```

### `AuthHelper.getAuthHeaders()`
```javascript
const headers = AuthHelper.getAuthHeaders();
fetch(API_URL, { headers });
```

### `AuthHelper.getUserInfo()`
```javascript
const user = AuthHelper.getUserInfo();
console.log(user.username); // "kiennv"
console.log(user.expiresAt); // Date object
```

### `AuthHelper.logout()`
```javascript
AuthHelper.logout();
// Xóa token và redirect về /admin/login.html
```

### `AuthHelper.authenticatedFetch(url, options)`
```javascript
// Fetch với token tự động, auto-logout nếu 401/403
try {
  const data = await AuthHelper.authenticatedFetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ name: "test" })
  });
  console.log(data);
} catch (error) {
  console.error(error);
}
```

---

## 💡 VÍ DỤ SỬ DỤNG

### Example 1: Load data với authentication
```javascript
async function loadData() {
  try {
    const headers = window.AuthHelper.getAuthHeaders();
    
    const response = await fetch("http://14.225.71.26:8080/api/data", {
      headers
    });

    if (response.status === 401 || response.status === 403) {
      // Token hết hạn
      AuthHelper.removeToken();
      alert("Session expired. Please login again.");
      window.location.href = "/admin/login.html";
      return;
    }

    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Example 2: Kiểm tra auth trước khi load page
```javascript
// Trong file admin pages
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra authentication
  if (!window.AuthHelper || !AuthHelper.isAuthenticated()) {
    alert("Bạn cần đăng nhập để truy cập trang này");
    window.location.href = "/admin/login.html";
    return;
  }

  // Hiển thị user info
  const userInfo = AuthHelper.getUserInfo();
  document.getElementById("username-display").textContent = userInfo.username;

  // Load data
  loadData();
});
```

### Example 3: Logout button
```javascript
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    AuthHelper.logout();
  }
});
```

### Example 4: Sử dụng authenticatedFetch (Recommended)
```javascript
// Cách dễ nhất - tự động handle auth
async function updateProfile(data) {
  try {
    const result = await AuthHelper.authenticatedFetch(
      "http://14.225.71.26:8080/api/profile",
      {
        method: "PUT",
        body: JSON.stringify(data)
      }
    );
    
    alert("Cập nhật thành công!");
    return result;
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
}
```

---

## 🔧 ADMIN PAGES - THÊM AUTHENTICATION

### File: admin/index.html, FeaturePerson.html, etc.

**Thêm vào đầu file (sau các script vendor):**
```html
<!-- Load AuthHelper -->
<script src="../assets/javarscript/login.js"></script>

<!-- Protect page -->
<script>
  // Kiểm tra auth ngay khi load page
  if (!window.AuthHelper || !AuthHelper.isAuthenticated()) {
    alert("Bạn cần đăng nhập để truy cập trang này");
    window.location.href = "/admin/login.html";
  }
</script>
```

**Hiển thị username và logout button:**
```html
<div class="user-info">
  <span id="username-display"></span>
  <button onclick="AuthHelper.logout()">Đăng xuất</button>
</div>

<script>
  // Hiển thị username
  const userInfo = window.AuthHelper.getUserInfo();
  if (userInfo) {
    document.getElementById("username-display").textContent = 
      `Xin chào, ${userInfo.username}`;
  }
</script>
```

---

## 🚨 LƯU Ý QUAN TRỌNG

### 1. Load Order
**Đảm bảo `login.js` được load TRƯỚC các file cần dùng AuthHelper:**
```html
<script src="assets/javarscript/login.js"></script>
<script src="assets/js/UI_data.js"></script>
<script src="assets/js/contact.js"></script>
```

### 2. Public vs Private APIs
```javascript
// Nếu API là PUBLIC (không cần token):
const headers = window.AuthHelper ? window.AuthHelper.getAuthHeaders() : {
  "Content-Type": "application/json"
};

// Nếu API BẮT BUỘC cần token:
if (!window.AuthHelper || !AuthHelper.isAuthenticated()) {
  throw new Error("Authentication required");
}
const headers = AuthHelper.getAuthHeaders();
```

### 3. Token Expiration
Token tự động được kiểm tra khi:
- Gọi `isAuthenticated()`
- API trả về 401/403
- Page load (nếu có kiểm tra)

### 4. Security
- ✅ Token được lưu trong localStorage (tốt hơn hardcode)
- ✅ Token tự động refresh khi login lại
- ✅ Auto-logout khi token hết hạn
- ⚠️ Vẫn có thể bị XSS attack (nên implement CSP headers)

---

## 🎯 CHECKLIST CẦN LÀM TIẾP

### Frontend:
- [ ] Thêm auth check vào tất cả admin pages
- [ ] Thêm logout button
- [ ] Hiển thị username trong header
- [ ] Handle token expiration gracefully
- [ ] Test các API calls

### Backend (Khuyến nghị):
- [ ] Set token expiration time hợp lý (1-7 days)
- [ ] Implement refresh token mechanism
- [ ] Add rate limiting cho login endpoint
- [ ] Log authentication attempts

### Testing:
- [ ] Test login flow
- [ ] Test API calls với token
- [ ] Test token expiration
- [ ] Test logout
- [ ] Test khi không có token

---

## 📝 VÍ DỤ CẤU TRÚC TOKEN

```javascript
// JWT Token structure
{
  "sub": "kiennv",           // Username
  "iat": 1762230003,         // Issued at (timestamp)
  "exp": 1762833603          // Expires at (timestamp, 7 days later)
}

// Parsed bởi AuthHelper.getUserInfo()
{
  username: "kiennv",
  issuedAt: Date("2025-11-28T..."),
  expiresAt: Date("2025-12-05T...")
}
```

---

## 🔥 QUICK START

### Bước 1: User login
```
/admin/login.html → nhập username/password → token được lưu tự động
```

### Bước 2: Access admin pages
```
/admin/index.html → AuthHelper.isAuthenticated() → Load data với token
```

### Bước 3: API calls tự động dùng token
```javascript
// Không cần làm gì thêm, AuthHelper tự động inject token
const headers = window.AuthHelper.getAuthHeaders();
```

---

## ✅ HOÀN THÀNH!

Bây giờ website của bạn:
- ✅ Không còn hardcode JWT token
- ✅ Token động từ login
- ✅ Tự động handle authentication
- ✅ Dễ dàng maintain và scale
- ✅ An toàn hơn nhiều!

---

**Có thắc mắc?** Check lại file `assets/javarscript/login.js` để xem đầy đủ implementation.

