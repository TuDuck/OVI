const token = localStorage.getItem("token");

const res = await fetch("https://api.ovi.vn/user/profile", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
