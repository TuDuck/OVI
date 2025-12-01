const API_URL = "http://26.129.206.142:8080/api/services";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

let products = [];
let sortNameAsc = true;

// pagination state
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;

// Form handling
function openProductForm(clear = true) {
    if (clear) clearProductForm();
    const form = document.getElementById("productForm");
    const overlay = document.querySelector(".form-overlay");
    if (form && overlay) {
        form.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeProductForm() {
    const form = document.getElementById("productForm");
    const overlay = document.querySelector(".form-overlay");
    if (form && overlay) {
        form.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function clearProductForm() {
    const idEl = document.getElementById("id");
    if (idEl) idEl.value = "";
    const titleEl = document.getElementById("title");
    if (titleEl) titleEl.value = "";
    const sd = document.getElementById("shortDescription");
    if (sd) sd.value = "";
    const desc = document.getElementById("description");
    if (desc) desc.value = "";
    const st = document.getElementById("status");
    if (st) st.value = "1";

    const preview = document.getElementById("imagePreview");
    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }
    imageBase64 = null;
}

// Image handling
let imageBase64 = null;
function handleImageChange(event) {
    const file = event.target.files && event.target.files[0];
    const preview = document.getElementById("imagePreview");

    if (!file) {
        imageBase64 = null;
        if (preview) preview.style.display = "none";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        imageBase64 = e.target.result;
        if (preview) {
            preview.src = imageBase64;
            preview.style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

// Fetch paged results from /search

async function fetchProducts(page = 0) {
    currentPage = page;
    try {
        const title = document.getElementById("searchName")?.value?.trim() || "";
        // const category = document.getElementById("searchCategory")?.value?.trim() || "";
        const status = document.getElementById("searchStatus")?.value ?? "";

        let url = `${API_URL}`;
        const params = new URLSearchParams();

        // Nếu có điều kiện tìm kiếm → dùng /search
        if (title ||  status !== "") {
            if (title) params.append("title", title);
            // if (category) params.append("category", category);
            if (status !== "") params.append("status", status);
            params.append("page", page.toString());
            params.append("size", pageSize.toString());
            url = `${API_URL}/search?${params.toString()}`;
        } else {
            // Nếu không có điều kiện → dùng endpoint gốc có phân trang
            params.append("page", page.toString());
            params.append("size", pageSize.toString());
            url = `${API_URL}?${params.toString()}`;
        }

        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        const data = await res.json();

        // Chuẩn hóa dữ liệu từ backend
        if (Array.isArray(data)) {
            products = data;
            totalElements = products.length;
            totalPages = Math.ceil(totalElements / pageSize);
        } else {
            products = data.content || [];
            totalElements = data.totalElements || products.length;
            totalPages = data.totalPages || Math.ceil(totalElements / pageSize);
            currentPage = data.number || page;
        }

        // Lọc client-side (nếu backend chưa xử lý filter)
        if (title ||  status !== "") {
            products = products.filter(p => {
                const matchTitle = !title || (p.title || p.name || "").toLowerCase().includes(title.toLowerCase());
                // const matchCategory = !category || (p.category || "").toLowerCase().includes(category.toLowerCase());
                const matchStatus = status === "" || String(p.status ?? "").toLowerCase() === status.toLowerCase();
                return matchTitle &&  matchStatus;
            });
            totalElements = products.length;
            totalPages = Math.ceil(totalElements / pageSize);
        }

        // (Tùy chọn) Sắp xếp client-side theo tên
        products.sort((a, b) => {
            const A = (a.title || a.name || "").toLowerCase();
            const B = (b.title || b.name || "").toLowerCase();
            return A.localeCompare(B);
        });

        renderProductTable(paginateClient(products, currentPage));
        renderPagination();
    } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

// Hàm phân trang client
function paginateClient(arr, page) {
    const start = page * pageSize;
    return (arr || []).slice(start, start + pageSize);
}


// async function fetchProducts(page = 0) {
//     try {
//         const title = (document.getElementById("searchName")?.value || "").trim();
//         const category = (document.getElementById("searchCategory")?.value || "").trim();
//         const status = (document.getElementById("searchStatus")?.value ?? "").toString().trim();

//         const params = new URLSearchParams();
//         if (title) params.append("title", title);
//         if (category) params.append("category", category);
//         if (status !== "") params.append("status", status);
//         params.append("page", String(page));
//         params.append("size", String(pageSize));

//         const url = `${API_URL}/search?${params.toString()}`;

//         const response = await fetch(url, {
//             headers: { "Authorization": `Bearer ${TOKEN}`, "Accept": "application/json" }
//         });

//         if (!response.ok) {
//             const txt = await response.text().catch(() => null);
//             throw new Error(txt || `Server responded ${response.status}`);
//         }

//         const json = await response.json();

//         // Support different response shapes:
//         // 1) { content: [...], totalPages, totalElements }
//         // 2) array [...]
//         let items = [];
//         if (Array.isArray(json)) {
//             items = json;
//             totalElements = items.length;
//             totalPages = Math.ceil(totalElements / pageSize) || 1;
//         } else if (json && Array.isArray(json.content)) {
//             items = json.content;
//             totalElements = json.totalElements ?? (json.total ?? items.length);
//             totalPages = json.totalPages ?? Math.ceil(totalElements / pageSize);
//         } else if (json && Array.isArray(json.data)) {
//             // some APIs use data wrapper
//             items = json.data;
//             totalElements = json.totalElements ?? items.length;
//             totalPages = json.totalPages ?? Math.ceil(totalElements / pageSize);
//         } else {
//             // fallback: single object or empty
//             items = Array.isArray(json) ? json : (json ? [json] : []);
//             totalElements = items.length;
//             totalPages = Math.ceil(totalElements / pageSize) || 1;
//         }

//         products = items;
//         currentPage = Number(page);
//         renderProductTable(products);
//         renderPagination();
//     } catch (err) {
//         console.error("Lỗi khi tìm kiếm/phân trang:", err);
//     }
// }

// CRUD Operations (create/update/delete)
async function saveProduct() {
    const idVal = document.getElementById("id")?.value;
    const data = {
        title: document.getElementById("title")?.value,
        shortDescription: document.getElementById("shortDescription")?.value,
        description: document.getElementById("description")?.value,
        imageData: imageBase64 || null,
        status: parseInt(document.getElementById("status")?.value || "0")
    };

    if (idVal) data.id = parseInt(idVal);

    try {
        const method = idVal ? "PUT" : "POST";
        const url = idVal ? `${API_URL}/${idVal}` : API_URL;

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => null);
            throw new Error(errorText || "Lỗi khi lưu dữ liệu");
        }

        alert(idVal ? "✅ Cập nhật thành công!" : "✅ Thêm mới thành công!");
        // reload current page
        await fetchProducts(currentPage);
        closeProductForm();
    } catch (err) {
        console.error("Error details:", err);
        alert("❌ Lỗi: " + err.message);
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        if (!response.ok) throw new Error("Không tải được sản phẩm");
        const product = await response.json();

        if (document.getElementById("id")) document.getElementById("id").value = product.id ?? "";
        if (document.getElementById("title")) document.getElementById("title").value = product.title ?? "";
        if (document.getElementById("shortDescription")) document.getElementById("shortDescription").value = product.shortDescription ?? "";
        if (document.getElementById("description")) document.getElementById("description").value = product.description ?? "";
        if (document.getElementById("status")) document.getElementById("status").value = String(product.status ?? "1");

        if (product.imageData) {
            imageBase64 = product.imageData;
            const preview = document.getElementById("imagePreview");
            if (preview) {
                preview.src = imageBase64;
                preview.style.display = "block";
            }
        } else {
            imageBase64 = null;
        }

        openProductForm(false);
    } catch (err) {
        console.error("Error loading product:", err);
        alert("❌ Lỗi khi tải thông tin sản phẩm");
    }
}

async function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });

        if (response.ok) {
            alert("✅ Xóa thành công!");
            // reload current page (if last item on page removed, adjust)
            await fetchProducts(currentPage);
        } else {
            const txt = await response.text().catch(() => null);
            alert("❌ Xóa thất bại: " + (txt || response.status));
        }
    } catch (err) {
        alert("❌ Lỗi khi xóa!");
        console.error(err);
    }
}

// Render table
function renderProductTable(data) {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id ?? ""}</td>
                <td>${escapeHtml(p.title ?? "")}</td>
                <td>${escapeHtml(p.shortDescription ?? "")}</td>
                <td>${escapeHtml(p.description ?? "")}</td>
                <td>${p.status ? "✅" : "❌"}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editProduct(${p.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Simple HTML escape
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Pagination UI
function renderPagination() {
    let container = document.getElementById("pagination");
    if (!container) {
        // try to append after table
        const table = document.querySelector(".table-responsive") || document.querySelector("table");
        container = document.createElement("div");
        container.id = "pagination";
        container.className = "mt-3 d-flex justify-content-center";
        if (table && table.parentNode) table.parentNode.appendChild(container);
        else document.body.appendChild(container);
    }

    container.innerHTML = "";

    // if totalPages unknown, no pagination
    totalPages = Number(totalPages) || 0;

    if (totalPages <= 1) return;

    const ul = document.createElement("ul");
    ul.className = "pagination";

    // Prev
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage <= 0 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous">Prev</a>`;
    prevLi.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 0) fetchProducts(currentPage - 1);
    });
    ul.appendChild(prevLi);

    // page numbers (limit shown pages)
    const visible = 7;
    let start = Math.max(0, currentPage - Math.floor(visible / 2));
    let end = Math.min(totalPages - 1, start + visible - 1);
    if (end - start + 1 < visible) {
        start = Math.max(0, end - visible + 1);
    }

    for (let i = start; i <= end; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener("click", (e) => {
            e.preventDefault();
            if (i !== currentPage) fetchProducts(i);
        });
        ul.appendChild(li);
    }

    // Next
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next">Next</a>`;
    nextLi.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages - 1) fetchProducts(currentPage + 1);
    });
    ul.appendChild(nextLi);

    container.appendChild(ul);
}

// local filter fallback (not used when using server search)
function filterProducts() {
    const searchName = (document.getElementById("searchName")?.value || "").toLowerCase();
    const searchStatus = document.getElementById("searchStatus")?.value;
    return products.filter(p => {
        const matchName = !searchName || (p.title ?? "").toLowerCase().includes(searchName);
        const matchStatus = searchStatus === '' || p.status === (parseInt(searchStatus) === 1);
        return matchName && matchStatus;
    });
}

// Debounce helper
function debounce(fn, delay = 300) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // initial load via search endpoint (page 0)
    fetchProducts(0);

    const fileInput = document.getElementById("imageFile");
    if (fileInput) {
        fileInput.addEventListener("change", handleImageChange);
    }

    // Debounced search -> reset to page 0
    const debouncedFetch = debounce(() => fetchProducts(0), 350);
    ["searchName", "searchCategory", "searchStatus"].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", debouncedFetch);
            element.addEventListener("change", debouncedFetch);
        }
    });

    // Sort event
    const sortBtn = document.getElementById("sortNameBtn");
    if (sortBtn) {
        sortBtn.addEventListener("click", async () => {
            sortNameAsc = !sortNameAsc;
            // re-fetch current page then client-sort items
            await fetchProducts(currentPage);
            const icon = sortBtn.querySelector("i");
            if (icon) icon.className = `fas fa-sort-alpha-${sortNameAsc ? "down" : "up"}`;
        });
    }

    // Click outside to close
    const overlay = document.querySelector(".form-overlay");
    if (overlay) {
        overlay.addEventListener("click", closeProductForm);
    }
});