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
			const res = await fetch("http://14.225.71.26:8000/api/public/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (res.ok) {
				localStorage.setItem("token", data.token);
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
			const res = await fetch("http://14.225.71.26:8000/api/public/register", {
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
// 			const res = await fetch("http://14.225.71.26:8000/api/public/register", {
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
