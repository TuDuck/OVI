# 🔐 HƯỚNG DẪN BẢO VỆ ADMIN PAGES

## ✅ ĐÃ SETUP

### Files đã tạo:
1. ✅ `admin/js/auth-guard.js` - Script bảo vệ admin pages
2. ✅ `admin/index.html` - Đã được protect

### Cách hoạt động:
1. User truy cập admin page → Check token trong localStorage
2. ❌ Không có token → Redirect về `/admin/login.html`
3. ✅ Có token → Cho phép truy cập
4. Token hết hạn → Redirect về login

---

## 🚀 ÁP DỤNG CHO CÁC ADMIN PAGES KHÁC

### Danh sách pages cần protect:
- [ ] `admin/FeaturePerson.html`
- [ ] `admin/productService.html`
- [ ] `admin/news.html`
- [ ] `admin/contact.html`

### Cách thêm vào mỗi page:

#### Bước 1: Thêm vào `<body>` tag (ngay sau mở thẻ body)

```html
<body class="animsition">
    <!-- Load AuthHelper first -->
    <script src="../assets/javarscript/login.js"></script>
    <!-- Then load auth guard -->
    <script src="js/auth-guard.js"></script>
    
    <!-- Rest of your HTML -->
```

#### Bước 2: Update header để hiển thị username và logout

Tìm phần account dropdown và thay bằng:

```html
<div class="account-wrap">
    <div class="account-item clearfix js-item-menu">
        <div class="image"><img src="images/icon/avatar-01.jpg" alt="Admin"></div>
        <div class="content">
            <a class="js-acc-btn" href="#" id="username-display">ADMIN</a>
        </div>
        <div class="account-dropdown js-dropdown">
            <div class="account-dropdown__footer">
                <a href="#" onclick="logout(); return false;">
                    <i class="zmdi zmdi-power"></i>Đăng xuất
                </a>
            </div>
        </div>
    </div>
</div>
```

**Xong!** Không cần code thêm gì nữa.

---

## 🧪 TESTING

### Test Flow:

#### 1. Test Redirect khi chưa login
```
1. Mở browser Incognito
2. Truy cập: http://localhost:8081/admin/index.html
3. Kết quả: Tự động redirect về /admin/login.html
4. Alert: "Bạn cần đăng nhập để truy cập trang này!"
```

#### 2. Test Login thành công
```
1. Truy cập: http://localhost:8081/admin/login.html
2. Nhập username/password
3. Click "Sign In"
4. Kết quả: 
   - Token được lưu vào localStorage
   - Redirect về /admin/index.html
   - Hiển thị username trong header
```

#### 3. Test Logout
```
1. Đang ở admin page
2. Click nút "Đăng xuất"
3. Confirm dialog xuất hiện
4. Click OK
5. Kết quả:
   - Token bị xóa khỏi localStorage
   - Redirect về /admin/login.html
```

#### 4. Test Token Expired
```
1. Login thành công
2. Xóa token thủ công: localStorage.removeItem("token")
3. Reload page
4. Kết quả: Tự động redirect về login
```

---

## 📝 EXAMPLE: FeaturePerson.html

### BEFORE (không có protection):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... -->
</head>
<body class="animsition">
    <div class="page-wrapper">
        <!-- ... content ... -->
    </div>
    
    <script src="vendor/jquery-3.2.1.min.js"></script>
    <!-- ... other scripts ... -->
</body>
</html>
```

### AFTER (có protection):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... -->
</head>
<body class="animsition">
    <!-- 🔒 ADD THESE TWO LINES -->
    <script src="../assets/javarscript/login.js"></script>
    <script src="js/auth-guard.js"></script>
    
    <div class="page-wrapper">
        <!-- ... content ... -->
    </div>
    
    <script src="vendor/jquery-3.2.1.min.js"></script>
    <!-- ... other scripts ... -->
</body>
</html>
```

**Chỉ cần thêm 2 dòng script!**

---

## 🔧 ADVANCED: Sử dụng Token trong API Calls

### Trong các file JS của admin (featuredPerson.js, productService.js, etc.)

#### BEFORE (dùng token cứng):
```javascript
const TOKEN = "eyJhbGciOiJIUzI1NiJ9...";

fetch(API_URL, {
  headers: {
    "Authorization": `Bearer ${TOKEN}`
  }
});
```

#### AFTER (dùng token từ login):
```javascript
// Lấy token từ AuthHelper hoặc localStorage
const token = localStorage.getItem("token") || window.API_TOKEN;

fetch(API_URL, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

#### BEST PRACTICE (dùng AuthHelper):
```javascript
// AuthHelper tự động lấy token và handle errors
const headers = window.AuthHelper.getAuthHeaders();

fetch(API_URL, { headers });

// Hoặc dùng wrapper function
const data = await AuthHelper.authenticatedFetch(API_URL, {
  method: "POST",
  body: JSON.stringify({...})
});
```

---

## 🎯 CHECKLIST HOÀN CHỈNH

### Frontend:
- [x] Tạo `auth-guard.js`
- [x] Protect `admin/index.html`
- [ ] Protect `admin/FeaturePerson.html`
- [ ] Protect `admin/productService.html`
- [ ] Protect `admin/news.html`
- [ ] Protect `admin/contact.html`
- [ ] Update API calls để dùng token từ login

### Backend (nếu cần):
- [ ] Verify JWT token trên server
- [ ] Check token expiration
- [ ] Return 401 nếu token không hợp lệ
- [ ] Implement refresh token (optional)

### Testing:
- [ ] Test redirect khi chưa login
- [ ] Test login flow
- [ ] Test logout
- [ ] Test token expired
- [ ] Test API calls với token

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: "Identifier 'TOKEN' has already been declared"
**Nguyên nhân:** Nhiều files khai báo `const TOKEN`  
**Giải pháp:** Dùng `window.API_TOKEN` trong login.js, các file khác dùng `window.API_TOKEN`

### Vấn đề 2: Vẫn truy cập được admin page khi chưa login
**Nguyên nhân:** Chưa add auth-guard.js  
**Giải pháp:** Thêm 2 dòng script vào đầu `<body>`

### Vấn đề 3: Token hết hạn nhưng vẫn cho phép access
**Nguyên nhân:** auth-guard chỉ check có token, không check expiry  
**Giải pháp:** Đã xử lý trong auth-guard.js với `AuthHelper.isAuthenticated()`

### Vấn đề 4: Sau khi login, redirect về admin nhưng lại redirect về login
**Nguyên nhân:** Token chưa được lưu vào localStorage  
**Giải pháp:** Check file login.js, dòng `AuthHelper.setToken(data.token)`

---

## 📞 SUPPORT

Nếu có vấn đề, check console log:
```javascript
// In browser DevTools console
console.log("Token:", localStorage.getItem("token"));
console.log("AuthHelper:", window.AuthHelper);
console.log("UserInfo:", window.AuthHelper?.getUserInfo());
```

---

**Cập nhật:** 28/11/2025  
**Status:** ✅ Ready to use

