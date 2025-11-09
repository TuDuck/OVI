const auth = {
    config: {
        inputMap: {
            teacherId: 'login-teacherId',
            password: 'login-password'
        },
        api: {
            login: 'http://localhost:8080/auth/login'
        },
        redirectAfterLogin: 'index.html'
    },
    login() {
        const { teacherId: idField, password: passField } = auth.config.inputMap;
        const teacherId = document.getElementById(idField)?.value.trim();
        const password = document.getElementById(passField)?.value.trim();
    
        if (!teacherId || !password) {
            alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
            return;
        }
    
        fetch(auth.config.api.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teacherId, password })
        })
        .then(res => {
            if (!res.ok) throw new Error("❌ Đăng nhập thất bại!");
            return res.json();
        })
        .then(data => {
            if (!data.token) throw new Error("Không nhận được token từ server!");
            localStorage.setItem('token', data.token);
            localStorage.setItem('teacherId', teacherId);
            alert("✅ Đăng nhập thành công!");
    
            // 🔁 Điều kiện chuyển hướng tùy theo teacherId
            if (teacherId.toLowerCase() == 'admin') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'index2.html';
            }
    
            console.log(data.token);
        })
        .catch(err => {
            console.error("Lỗi đăng nhập:", err);
            alert("❌ Sai tài khoản hoặc mật khẩu!");
        });
    }
    
    ,


    logout() {
        localStorage.removeItem('token');
        alert("🚪 Đã đăng xuất!");
        window.location.href = "login.html";
    },

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }
};

// function parseJwt(token) {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));
//         return JSON.parse(jsonPayload);
//     } catch (e) {
//         console.error("Token không hợp lệ", e);
//         return null;
//     }
// }

// // Sử dụng:
// const token = localStorage.getItem('token');
// const payload = parseJwt(token);
// console.log(payload); // => Xem thông tin như teacherId, role, exp, ...

// Nếu muốn gọi: auth.login(); hoặc auth.logout();
