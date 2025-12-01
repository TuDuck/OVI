/**
 * ============================================
 * AUTH HELPER - Quản lý authentication token
 * ============================================
 */
const AuthHelper = {
	/**
	 * Lấy token từ localStorage
	 */
	getToken() {
		return localStorage.getItem("token");
	},

	/**
	 * Lưu token vào localStorage
	 */
	setToken(token) {
		localStorage.setItem("token", token);
	},

	/**
	 * Xóa token (logout)
	 */
	removeToken() {
		localStorage.removeItem("token");
	},

	/**
	 * Kiểm tra xem user đã login chưa
	 */
	isAuthenticated() {
		const token = this.getToken();
		if (!token) return false;

		try {
			const payload = this.parseJwt(token);
			const now = Date.now() / 1000;
			
			// Token hết hạn
			if (payload.exp && payload.exp < now) {
				this.removeToken();
				return false;
			}
			
			return true;
		} catch (error) {
			console.error("Invalid token:", error);
			this.removeToken();
			return false;
		}
	},

	/**
	 * Parse JWT token để lấy payload
	 */
	parseJwt(token) {
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
	},

	/**
	 * Lấy headers cho API request với token
	 */
	getAuthHeaders() {
		const token = this.getToken();
		if (!token) {
			console.warn("No authentication token found");
			return {
				"Content-Type": "application/json"
			};
		}

		return {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		};
	},

	/**
	 * Logout và redirect về login page
	 */
	logout() {
		this.removeToken();
		window.location.href = "/admin/login.html";
	},

	/**
	 * Lấy thông tin user từ token
	 */
	getUserInfo() {
		const token = this.getToken();
		if (!token) return null;

		try {
			const payload = this.parseJwt(token);
			return {
				username: payload.sub,
				issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
				expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
			};
		} catch (error) {
			console.error("Cannot parse user info:", error);
			return null;
		}
	},

	/**
	 * Fetch wrapper với token tự động
	 */
	async authenticatedFetch(url, options = {}) {
		try {
			const headers = this.getAuthHeaders();
			
			const response = await fetch(url, {
				...options,
				headers: {
					...headers,
					...options.headers
				}
			});

			// Token hết hạn hoặc không hợp lệ
			if (response.status === 401 || response.status === 403) {
				console.warn("Authentication failed, redirecting to login...");
				this.logout();
				throw new Error("Authentication failed");
			}

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Authenticated fetch error:", error);
			throw error;
		}
	}
};

// Export AuthHelper ra global scope để các file khác dùng được
window.AuthHelper = AuthHelper;

// Token cố định cho API calls (shared across all files)
window.API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

/**
 * ============================================
 * UI LOGIN/REGISTER
 * ============================================
 */
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

//login form submission
const auth = {
	init() {
		document.getElementById("loginForm").addEventListener("submit", this.login);
	},

	async login(e) {
		e.preventDefault();

		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;

		try {
			const res = await fetch("http://26.129.206.142:8080/api/public/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (res.ok) {
				// Sử dụng AuthHelper để lưu token
				AuthHelper.setToken(data.token);
				
				// Log thông tin user
				const userInfo = AuthHelper.getUserInfo();
				console.log("User logged in:", userInfo);
				
				alert("Đăng nhập thành công!");
				window.location.href = "/admin/index.html";
			} else {
				alert(data.message || "Sai tài khoản hoặc mật khẩu!");
			}
		} catch (err) {
			console.error(err);
			alert("Lỗi kết nối đến server!");
		}
	},
};

// Kích hoạt sau khi DOM load xong
window.addEventListener("DOMContentLoaded", () => auth.init());


//register form submission

const register = {
	init() {
		document.getElementById("registerForm").addEventListener("submit", this.submit);
	},

	async submit(e) {
		e.preventDefault();

		const email = document.getElementById("reg_email").value;
		const username = document.getElementById("reg_username").value;
		const password = document.getElementById("reg_password").value;
		const role = "ADMIN";

		try {
			const res = await fetch("http://26.129.206.142:8080/api/public/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password, role, email }),
			});

			// ✅ Chỉ cần kiểm tra status thay vì parse JSON
			if (res.ok || res.status === 200) {
				alert("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
				window.location.href = "login.html";
			} else {
				// Nếu có body thì thử đọc text để log
				const errorText = await res.text();
				console.warn("Server response:", errorText);
				alert("Đăng ký thất bại! Mã lỗi: " + res.status);
			}
		} catch (err) {
			console.error(err);
			alert("Lỗi kết nối đến server!");
		}
	},
};


// const register = {
// 	init() {
// 		document.getElementById("registerForm").addEventListener("submit", this.submit);
// 	},

// 	async submit(e) {
// 		e.preventDefault();

// 		const email = document.getElementById("reg_email").value;
// 		const username = document.getElementById("reg_username").value;
// 		const password = document.getElementById("reg_password").value;

// 		// Email và role có thể tự nhập hoặc gán mặc định
// 		const role = "ADMIN"; // hoặc cho chọn qua dropdown

// 		try {
// 			const res = await fetch("http://26.129.206.142:8080/api/public/register", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					username,
// 					password,
// 					role,
// 					email,
// 				}),
// 			});

// 			const data = await res.json();

// 			if (res.ok) {
// 				alert("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
// 				window.location.href = "login.html";
// 			} else {
// 				alert(data.message || "Đăng ký thất bại!");
// 			}
// 		} catch (err) {
// 			console.error(err);
// 			alert("Lỗi kết nối đến server!");
// 		}
// 	},
// };

// Kích hoạt sau khi DOM load xong
window.addEventListener("DOMContentLoaded", () => register.init());
