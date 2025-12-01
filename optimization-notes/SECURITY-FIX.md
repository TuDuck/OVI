# 🔒 BẢO MẬT - JWT TOKEN FIX

## ⚠️ VẤN ĐỀ NGHIÊM TRỌNG

JWT Token đang bị lộ công khai trong 2 files:
1. `assets/js/UI_data.js` - line 3
2. `assets/js/contact.js` - line 26

```javascript
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyMzAwMDN9.RPI0R1UgVl3V4yuoXbm6I2H6xV8whs1DXy065i4kzXI";
```

## 🎯 TÁC ĐỘNG

- ❌ Ai cũng có thể xem token trong DevTools
- ❌ Có thể dùng token này để gọi API của bạn
- ❌ Token decode ra username: "kiennv"
- ❌ Có thể abuse API endpoints

## ✅ GIẢI PHÁP

### Phương án 1: Public API (Đơn giản nhất - Khuyến nghị)

Cho phép các endpoint công khai không cần token:

**Backend (Spring Boot):**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/services", "/api/featuredPerson").permitAll() // Public
                .requestMatchers("/api/contact").permitAll() // Cho phép gửi contact
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

**Frontend:**
```javascript
// assets/js/UI_data.js
const API_URL_LEADER = "http://26.129.206.142:8080/api/featuredPerson?type=LEADER";
const API_URL_SERVICES = "http://26.129.206.142:8080/api/services";

async function loadLeaders() {
  try {
    const response = await fetch(API_URL_LEADER); // Không cần token
    const data = await response.json();
    // ... render
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

### Phương án 2: API Key (Trung bình)

Tạo API key riêng cho public access với quyền READ-ONLY:

**Backend:**
```java
@RestController
@RequestMapping("/api")
public class PublicApiController {
    
    @Value("${app.public.api.key}")
    private String publicApiKey;
    
    @GetMapping("/services")
    public ResponseEntity<?> getServices(
        @RequestHeader(value = "X-API-Key", required = false) String apiKey
    ) {
        if (!publicApiKey.equals(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(serviceRepository.findAll());
    }
}
```

**Frontend:**
```javascript
const PUBLIC_API_KEY = "ovi_public_2025_readonly"; // Ít nguy hiểm hơn JWT

async function loadServices() {
  const response = await fetch(API_URL_SERVICES, {
    headers: {
      "X-API-Key": PUBLIC_API_KEY
    }
  });
  // ...
}
```

---

### Phương án 3: Backend Proxy (An toàn nhất)

Tạo backend endpoint proxy để ẩn token:

**Backend:**
```java
@RestController
@RequestMapping("/api/public")
public class PublicProxyController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${internal.api.token}")
    private String internalToken;
    
    @GetMapping("/services")
    public ResponseEntity<?> getServices() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(internalToken); // Token chỉ ở backend
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<List<Service>> response = restTemplate.exchange(
            "http://internal-api/services",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<Service>>() {}
        );
        
        return ResponseEntity.ok(response.getBody());
    }
}
```

**Frontend:**
```javascript
const API_URL = "http://26.129.206.142:8080/api/public/services";

async function loadServices() {
  const response = await fetch(API_URL); // Không cần header gì cả
  const data = await response.json();
  // ...
}
```

---

### Phương án 4: Environment Variable (Temporary)

Nếu không thể sửa backend ngay:

**Frontend:**
```javascript
// Tạo file: assets/js/config.js (KHÔNG commit file này vào git)
const API_CONFIG = {
  token: "eyJ...", // Token ở đây
  baseUrl: "http://26.129.206.142:8080"
};

// Thêm vào .gitignore
// assets/js/config.js

// Trong UI_data.js
import { API_CONFIG } from './config.js';

async function loadServices() {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/services`, {
    headers: {
      "Authorization": `Bearer ${API_CONFIG.token}`
    }
  });
}
```

---

## 📋 HÀNH ĐỘNG CẦN LÀM NGAY

### Bước 1: Revoke token hiện tại (Ngay lập tức)
```bash
# Gọi API để invalidate token cũ
curl -X POST http://26.129.206.142:8080/api/auth/logout \
  -H "Authorization: Bearer eyJ..."
```

### Bước 2: Tạo token/API key mới
- Tạo token mới với quyền hạn thấp hơn
- Hoặc implement một trong các phương án trên

### Bước 3: Update code
- Xóa token khỏi frontend code
- Deploy phương án đã chọn

### Bước 4: Test
- Test tất cả API calls
- Verify token cũ không còn work

---

## 🎯 KHUYẾN NGHỊ

**Cho dự án này, nên dùng Phương án 1 (Public API)**

Lý do:
- ✅ Đơn giản nhất, ít code nhất
- ✅ Data là công khai (services, leaders) nên không cần bảo mật
- ✅ Contact form có thể public (có rate limiting)
- ✅ Không ảnh hưởng performance

**Riêng Contact API:**
- Thêm rate limiting (max 5 requests/IP/hour)
- Thêm CAPTCHA nếu cần

```java
@PostMapping("/api/contact")
@RateLimit(requests = 5, duration = 1, unit = TimeUnit.HOURS)
public ResponseEntity<?> submitContact(@RequestBody ContactRequest request) {
    // Handle contact
}
```

---

## ⏰ TIMELINE

| Task | Thời gian | Người thực hiện |
|------|-----------|-----------------|
| Revoke token cũ | 5 phút | Backend Dev |
| Update backend endpoints | 30 phút | Backend Dev |
| Update frontend code | 30 phút | Frontend Dev |
| Testing | 20 phút | QA |
| Deploy | 15 phút | DevOps |
| **TỔNG** | **< 2 giờ** | |

---

## 📝 CHECKLIST

- [ ] Revoke token cũ
- [ ] Implement phương án đã chọn (recommend: Phương án 1)
- [ ] Update frontend code
- [ ] Remove TOKEN constant từ UI_data.js
- [ ] Remove TOKEN constant từ contact.js
- [ ] Test API calls
- [ ] Verify old token không work
- [ ] Deploy lên production
- [ ] Update tài liệu API
- [ ] Thông báo team

---

**Priority:** 🔴 CRITICAL  
**Deadline:** Ngay hôm nay  
**Status:** ⏳ Chờ xử lý

