/**
 * AUTH GUARD - Bảo vệ admin pages
 * Tự động redirect về login nếu chưa authenticate
 * Block direct access từ URL ngoài
 */

(function() {
    console.log("🔒 Kiểm tra bảo mật...");
    
    // Clear token và redirect về login
    function redirectToLogin(message) {
        console.warn("❌ Auth failed:", message);
        alert(message);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        
        // Redirect to login page
        const loginUrl = window.location.origin + "/admin/login.html";
        console.log("→ Redirecting to:", loginUrl);
        window.location.replace(loginUrl); // Use replace to prevent back button
        
        // Stop further script execution
        throw new Error("Authentication required");
    }
    
    // Check authentication ngay khi load page
    const token = localStorage.getItem("token");
    
    if (!token) {
        redirectToLogin("Bạn cần đăng nhập để truy cập trang admin!");
        return;
    }

    // Parse và validate token
    try {
        const payload = parseJWT(token);
        console.log("📋 Token info:", {
            user: payload.sub,
            issued: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'N/A',
            expires: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A'
        });
        
        // Check token expiration
        if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp < now) {
                console.warn("⏰ Token expired at:", new Date(payload.exp * 1000));
                redirectToLogin("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                return;
            }
            
            // Warn if token will expire soon (< 1 hour)
            const timeLeft = payload.exp - now;
            if (timeLeft < 3600) {
                const minutesLeft = Math.floor(timeLeft / 60);
                console.warn("⚠️ Token sẽ hết hạn trong " + minutesLeft + " phút");
                
                // Show warning if less than 15 minutes
                if (timeLeft < 900) {
                    alert("⚠️ Cảnh báo: Phiên đăng nhập sẽ hết hạn trong " + minutesLeft + " phút!");
                }
            }
        }
        
        console.log("✅ Authentication successful. User:", payload.sub);
    } catch (error) {
        console.error("❌ Invalid token format:", error);
        redirectToLogin("Token không hợp lệ. Vui lòng đăng nhập lại!");
        return;
    }

    // Verify với AuthHelper nếu có
    if (window.AuthHelper && !AuthHelper.isAuthenticated()) {
        console.warn("❌ AuthHelper validation failed");
        redirectToLogin("Xác thực thất bại. Vui lòng đăng nhập lại!");
        return;
    }
    
    console.log("✅ Auth Guard: Access granted");
})();

/**
 * Parse JWT token
 */
function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        throw new Error("Invalid token format");
    }
}

/**
 * Display user info in header
 */
function displayUserInfo() {
    if (window.AuthHelper) {
        const userInfo = AuthHelper.getUserInfo();
        if (userInfo) {
            const usernameDisplay = document.getElementById("username-display");
            if (usernameDisplay) {
                usernameDisplay.textContent = userInfo.username;
            }
        }
    }
}

/**
 * Logout function
 */
function logout() {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
        console.log("🔓 Đang đăng xuất...");
        
        // Clear all authentication data
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        
        // Clear AuthHelper if available
        if (window.AuthHelper && typeof AuthHelper.removeToken === 'function') {
            AuthHelper.removeToken();
        }
        
        alert("✅ Đăng xuất thành công!");
        
        // Redirect to login page
        const loginUrl = window.location.origin + "/admin/login.html";
        window.location.replace(loginUrl);
    }
}

// Auto display user info when DOM loaded
document.addEventListener("DOMContentLoaded", displayUserInfo);

