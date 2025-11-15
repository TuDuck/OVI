const API_URL = "http://14.225.71.26:8000/api/contact";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

let messages = [];
let sortNameAsc = true;
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;

// Load messages with pagination - chỉnh sửa
async function loadMessages(page = 0) {
    currentPage = page; // Set currentPage to the requested page
    try {
        const searchName = document.getElementById('searchName')?.value?.trim() || '';
        const searchEmail = document.getElementById('searchEmail')?.value?.trim() || '';
        const searchPhone = document.getElementById('searchPhone')?.value?.trim() || '';

        let url = `${API_URL}`;
        
        // Nếu có bất kỳ điều kiện tìm kiếm nào, sử dụng endpoint search
        if (searchName || searchEmail || searchPhone) {
            const params = new URLSearchParams();
            if (searchName) params.append('name', searchName);
            if (searchEmail) params.append('email', searchEmail); 
            if (searchPhone) params.append('phone', searchPhone);
            params.append('page', page.toString());
            params.append('size', pageSize.toString());
            url = `${API_URL}/search?${params.toString()}`;
        } else {
            // Nếu không có điều kiện tìm kiếm, sử dụng endpoint getAll với phân trang
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', pageSize.toString());
            url = `${API_URL}?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        
        // Xử lý response từ server
        if (Array.isArray(data)) {
            messages = data;
            totalElements = messages.length;
            totalPages = Math.ceil(totalElements / pageSize);
        } else {
            messages = data.content || [];
            totalElements = data.totalElements || messages.length;
            totalPages = data.totalPages || Math.ceil(totalElements / pageSize);
            currentPage = data.number || page; // Ensure currentPage is set correctly
        }

        // Client-side filtering nếu server không hỗ trợ search
        if (searchName || searchEmail || searchPhone) {
            messages = messages.filter(m => {
                const matchName = !searchName || (m.name || "").toLowerCase().includes(searchName.toLowerCase());
                const matchEmail = !searchEmail || (m.email || "").toLowerCase().includes(searchEmail.toLowerCase());
                const matchPhone = !searchPhone || (m.phone || "").includes(searchPhone);
                return matchName && matchEmail && matchPhone;
            });
            totalElements = messages.length;
            totalPages = Math.ceil(totalElements / pageSize);
        }

        renderMessageTable(paginateClient(messages, currentPage));
        renderPagination();
    } catch (err) {
        console.error("Error loading messages:", err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

function paginateClient(arr, page) {
    const start = page * pageSize;
    return arr.slice(start, start + pageSize);
}

// Render messages table
function renderMessageTable(data) {
    const tbody = document.getElementById("contactTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach(m => {
        tbody.innerHTML += `
            <tr>
                <td>${m.id || ""}</td>
                <td>${escapeHtml(m.name || "")}</td>
                <td>${escapeHtml(m.email || "")}</td>
                <td>${escapeHtml(m.phone || "")}</td>
                <td>${escapeHtml((m.message || "").substring(0, 50))}${(m.message || "").length > 50 ? "..." : ""}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewMessageDetail(${m.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMessage(${m.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// View message detail
async function viewMessageDetail(id) {
    const message = messages.find(m => m.id === id);
    if (!message) return;

    // Remove readonly attribute from form inputs
    document.getElementById("messageId").value = message.id || "";
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const phoneInput = document.getElementById("contactPhone");
    const messageInput = document.getElementById("contactMessage");

    nameInput.value = message.name || "";
    emailInput.value = message.email || "";
    phoneInput.value = message.phone || "";
    messageInput.value = message.message || "";

    // Remove readonly attributes
    nameInput.removeAttribute("readonly");
    emailInput.removeAttribute("readonly");
    phoneInput.removeAttribute("readonly");
    messageInput.removeAttribute("readonly");

    document.getElementById("messageDetailForm").classList.add("active");
    document.querySelector(".form-overlay").classList.add("active");
    document.body.style.overflow = 'hidden';

    updateFormTitle(id);
}

function closeMessageDetail() {
    document.getElementById("messageDetailForm").classList.remove("active");
    document.querySelector(".form-overlay").classList.remove("active");
    document.body.style.overflow = '';
}

// Delete message
async function deleteMessage(id) {
    if (!confirm("Bạn có chắc muốn xóa tin nhắn này?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });

        if (!response.ok) throw new Error('Delete failed');

        alert("✅ Xóa thành công!");
        loadMessages(currentPage);
    } catch (err) {
        console.error("Error deleting message:", err);
        alert("❌ Lỗi khi xóa tin nhắn!");
    }
}

// Add function to open form in "add" mode
function openAddContactForm() {
    // Clear form fields
    document.getElementById("messageId").value = "";
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactMessage").value = "";

    // Show form
    document.getElementById("messageDetailForm").classList.add("active");
    document.querySelector(".form-overlay").classList.add("active");
    document.body.style.overflow = 'hidden';
}

// Modify saveMessage to handle both add and edit
async function saveMessage() {
    const id = document.getElementById("messageId").value;
    const data = {
        name: document.getElementById("contactName").value,
        email: document.getElementById("contactEmail").value,
        phone: document.getElementById("contactPhone").value,
        message: document.getElementById("contactMessage").value
    };

    try {
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;
        
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(id ? 'Update failed' : 'Add failed');

        alert(id ? "✅ Cập nhật thành công!" : "✅ Thêm mới thành công!");
        loadMessages(currentPage);
        closeMessageDetail();
    } catch (err) {
        console.error("Error saving message:", err);
        alert(`❌ Lỗi khi ${id ? 'cập nhật' : 'thêm mới'}!`);
    }
}

// Update form title based on mode
function updateFormTitle(id) {
    const title = document.querySelector("#messageDetailForm h4");
    if (title) {
        title.innerHTML = id ? "📧 Chi tiết tin nhắn" : "📧 Thêm liên hệ mới";
    }
}

// Pagination UI
function renderPagination() {
    const container = document.getElementById("pagination");
    if (!container) return;
    container.innerHTML = "";

    if (totalPages <= 1) return;

    const ul = document.createElement("ul");
    ul.className = "pagination";

    // Previous
    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage <= 0 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prev.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage > 0) loadMessages(currentPage - 1);
    });
    ul.appendChild(prev);

    // Page numbers
    const maxVisible = 5;
    let start = Math.max(0, Math.min(currentPage - Math.floor(maxVisible / 2), totalPages - maxVisible));
    let end = Math.min(totalPages, start + maxVisible);

    for (let i = start; i < end; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener("click", e => {
            e.preventDefault();
            if (i !== currentPage) loadMessages(i);
        });
        ul.appendChild(li);
    }

    // Next
    const next = document.createElement("li");
    next.className = `page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`;
    next.innerHTML = `<a class="page-link" href="#">Next</a>`;
    next.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage < totalPages - 1) loadMessages(currentPage + 1);
    });
    ul.appendChild(next);

    container.appendChild(ul);
}

// Utilities
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Initial load
    loadMessages(0);

    // Search
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const debouncedSearch = debounce(() => loadMessages(0), 300);

    ['searchName', 'searchEmail', 'searchPhone'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', debouncedSearch);
            element.addEventListener('change', debouncedSearch);
        }
    });

    // Sort
    const sortBtn = document.getElementById('sortNameBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            sortNameAsc = !sortNameAsc;
            messages.sort((a, b) => {
                const A = (a.name || "").toLowerCase();
                const B = (b.name || "").toLowerCase();
                return sortNameAsc ? A.localeCompare(B) : B.localeCompare(A);
            });
            renderMessageTable(paginateClient(messages, currentPage));
            const icon = sortBtn.querySelector('i');
            icon.className = `fas fa-sort-alpha-${sortNameAsc ? "down" : "up"}`;
        });
    }

    // Close on overlay click
    const overlay = document.querySelector(".form-overlay");
    if (overlay) overlay.addEventListener("click", closeMessageDetail);
});