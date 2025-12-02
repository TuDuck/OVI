const API_URL = "http://26.129.206.142:8080/api/featuredPerson/search";
const API_URL_CRUD = "http://26.129.206.142:8080/api/featuredPerson";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

let imageBase64 = null; //khai báo biến toàn cục để lưu base64 của hình ảnh
let persons = []; // Mảng lưu tất cả persons
let sortNameAsc = true; // Toggle sắp xếp tên

// Add pagination state
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;

function openPersonAddForm(clear = true) {
    if (clear) clearPersonForm();
    document.getElementById("addPersonForm").classList.add("active");
    document.querySelector(".form-overlay").classList.add("active");
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function clearPersonForm() {
    // reset các trường để chuẩn bị thêm mới
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("role").value = "";
    document.getElementById("description").value = "";
    document.getElementById("link").value = "";
    document.getElementById("type").value = "COMPANY";
    document.getElementById("status").value = "1";
    const preview = document.getElementById("imagePreview");
    imageBase64 = null;
    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }
}

function closePersonAddForm() {
    document.getElementById("addPersonForm").classList.remove("active");
    document.querySelector(".form-overlay").classList.remove("active");
    document.body.style.overflow = ''; // Restore scrolling
}

// Thêm event listener để đóng form khi click outside
document.addEventListener("DOMContentLoaded", () => {
    // Click outside to close
    const overlay = document.querySelector(".form-overlay");
    if (overlay) {
        overlay.addEventListener("click", closePersonAddForm);
    }
});

//Xử lý hình ảnh
function handleImageFileChange(event) {
    const file = event.target.files && event.target.files[0];
    const preview = document.getElementById("imagePreview");
    if (!file) {
        imageBase64 = null;
        if (preview) preview.style.display = "none";
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        imageBase64 = reader.result; // data:[mime];base64,...
        if (preview) {
            preview.src = imageBase64;
            preview.style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

async function savePerson() {
    const idVal = document.getElementById("id").value;
    const linkVal = document.getElementById("link").value || null;
    const data = {
        id: parseInt(document.getElementById("id").value),
        name: document.getElementById("name").value,
        role: document.getElementById("role").value,
        description: document.getElementById("description").value,
        imageData: imageBase64 || null, // Sử dụng biến toàn cục chứa base64 thay vì element ko tồn tại
        link: linkVal,
        type: document.getElementById("type").value,
        status: parseInt(document.getElementById("status").value),
        createdAt: null,
        updatedAt: null
    };

    try {
        // Kiểm tra có ID không để quyết định method và URL
        const method = idVal ? "PUT" : "POST";
        const url = idVal ? `${API_URL_CRUD}/${idVal}` : API_URL_CRUD;

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        alert(idVal ? "✅ Cập nhật thành công!" : "✅ Thêm thành công!");
        loadPersons();
        closePersonAddForm();
    } catch (err) {
        alert("❌ Lỗi: " + err.message);
        console.error(err);
    }
}

async function editPerson(id) {
    try {
        const response = await fetch(`${API_URL_CRUD}/${id}`, {
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        if (!response.ok) throw new Error("Không thể lấy dữ liệu person");
        const p = await response.json();

        // điền dữ liệu vào form
        document.getElementById("id").value = p.id || "";
        document.getElementById("name").value = p.name || "";
        document.getElementById("role").value = p.role || "";
        document.getElementById("description").value = p.description || "";
        document.getElementById("link").value = p.link || "";
        document.getElementById("type").value = p.type || "COMPANY";
        document.getElementById("status").value = (typeof p.status !== "undefined") ? String(p.status) : "1";

        // xử lý ảnh: ưu tiên trường imageData nếu API trả về base64, hoặc trường imageUrl nếu có
        const preview = document.getElementById("imagePreview");
        if (p.imageData) {
            imageBase64 = p.imageData;
            if (preview) {
                preview.src = imageBase64;
                preview.style.display = "block";
            }
        } else if (p.imageUrl) {
            imageBase64 = null;
            if (preview) {
                preview.src = p.imageUrl;
                preview.style.display = "block";
            }
        } else {
            imageBase64 = null;
            if (preview) preview.style.display = "none";
        }

        // mở form nhưng không xóa dữ liệu (clear = false)
        openPersonAddForm(false);
    } catch (err) {
        console.error("Lỗi khi load để sửa:", err);
        alert("Không tải được dữ liệu để sửa.");
    }
}

// Hàm lọc persons theo điều kiện tìm kiếm
async function loadPersons(page = 0) {
    currentPage = page;
    try {
        // Lấy giá trị tìm kiếm từ input
        const name = document.getElementById('searchName')?.value?.trim() || '';
        const searchType = document.getElementById('searchType')?.value?.trim() || '';
        // const searchStatus = document.getElementById('searchStatus')?.value || '';

        // Build query params
        const params = new URLSearchParams();
        if (name) params.append('keyword', name);
        if (searchType) params.append('type', searchType);
        // if (searchStatus) params.append('status', searchStatus);
        params.append('page', page);
        params.append('size', pageSize);

        const url = `${API_URL}?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error('Không thể tải dữ liệu');

        const data = await response.json();

        // Xử lý response dạng page hoặc array
        let persons = Array.isArray(data) ? data : data.content || [];
        totalElements = data.totalElements ?? persons.length;
        totalPages = data.totalPages ?? Math.ceil(totalElements / pageSize);
        currentPage = data.number ?? page;

        renderPersonTable(persons);
        renderPagination();
    } catch (err) {
        console.error("Lỗi khi tải danh sách:", err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

// Hàm render bảng
function renderPersonTable(persons) {
    const tbody = document.getElementById("personTableBody");
    tbody.innerHTML = "";
    persons.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.name || ''}</td>
                <td>${p.role || ''}</td>
                <td>${p.type || ''}</td>
                <td>${p.status ? "✅" : "❌"}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editPerson(${p.id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePerson(${p.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// Pagination
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const maxVisible = 5;
    let start = Math.max(0, Math.min(currentPage - Math.floor(maxVisible/2), totalPages - maxVisible));
    let end = Math.min(totalPages, start + maxVisible);

    let html = `<ul class="pagination">
        <li class="page-item ${currentPage <= 0 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadPersons(${currentPage - 1}); return false;">Previous</a>
        </li>`;

    for (let i = start; i < end; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="loadPersons(${i}); return false;">${i + 1}</a>
        </li>`;
    }

    html += `<li class="page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadPersons(${currentPage + 1}); return false;">Next</a>
        </li></ul>`;

    container.innerHTML = html;
}

function generatePageNumbers() {
    let html = '';
    const maxVisible = 5;
    let start = Math.max(0, Math.min(currentPage - Math.floor(maxVisible / 2), totalPages - maxVisible));
    let end = Math.min(totalPages, start + maxVisible);

    for (let i = start; i < end; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadPersons(${i}); return false;">${i + 1}</a>
            </li>
        `;
    }
    return html;
}

async function deletePerson(id) {
    if (!confirm("Bạn có chắc muốn xóa người này không?")) return;

    try {
        const response = await fetch(`${API_URL_CRUD}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        if (response.ok) {
            alert("🗑️ Xóa thành công!");
            loadPersons();
        } else {
            alert("❌ Xóa thất bại!");
        }
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Initial load with page 0
    loadPersons(0);
    
    // Handle file input
    const fileInput = document.getElementById("imageFile");
    if (fileInput) fileInput.addEventListener("change", handleImageFileChange);

    // Debounce search inputs to avoid too many requests
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const debouncedSearch = debounce(() => loadPersons(0), 300);

    ['searchName', 'searchRole', 'searchType', 'searchStatus'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', debouncedSearch);
            element.addEventListener('change', debouncedSearch);
        }
    });

    // Sort button
    const sortBtn = document.getElementById('sortNameBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            sortNameAsc = !sortNameAsc;
            const sorted = sortByName([...persons]);
            renderPersonTable(sorted);
            const icon = sortBtn.querySelector('i');
            icon.className = sortNameAsc ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up';
        });
    }
});
