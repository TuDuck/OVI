/**
 * ADMIN PROFILE COMPANY MANAGEMENT
 * API Response Format:
 * {
 *   "id": 1,
 *   "companyName": "Công ty ABC",
 *   "createdAt": "2025-11-26T09:48:10.298648",
 *   "description": "Hồ sơ năng lực",
 *   "fileData": "base64string...",
 *   "fileName": "7.Giay_de_nghi_chi_phi_giao_te_Cong_ty_Ovi.docx",
 *   "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
 *   "updatedAt": null
 * }
 */

const PROFILE_API = "http://26.129.206.142:8080/api/company-profile";
const TOKEN = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

let profileItems = [];
let sortCompanyNameAsc = true;
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;

// File data for upload
let selectedFile = null; // Store File object instead of base64

function openProfileForm(clear = true) {
    if (clear) clearProfileForm();
    document.getElementById("profileForm").classList.add("active");
    document.querySelector(".form-overlay").classList.add("active");
    document.body.style.overflow = 'hidden';
}

function closeProfileForm() {
    document.getElementById("profileForm").classList.remove("active");
    document.querySelector(".form-overlay").classList.remove("active");
    document.body.style.overflow = '';
}

function clearProfileForm() {
    const id = document.getElementById("profileId");
    if (id) id.value = "";
    const companyName = document.getElementById("profileCompanyName");
    if (companyName) companyName.value = "";
    const description = document.getElementById("profileDescription");
    if (description) description.value = "";
    const file = document.getElementById("profileFile");
    if (file) file.value = "";
    const fileInfo = document.getElementById("fileInfo");
    if (fileInfo) fileInfo.style.display = "none";
    selectedFile = null;
}

// Handle file input - store File object
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("profileFile");
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) {
                selectedFile = null;
                return;
            }
            selectedFile = file; // Store File object directly
        });
    }
});

async function fetchProfiles(page = 0) {
    currentPage = page;
    try {
        const companyName = document.getElementById("searchCompanyName")?.value?.trim() || "";
        const description = document.getElementById("searchDescription")?.value?.trim() || "";
        const fileTypeFilter = document.getElementById("filterFileType")?.value || "";

        // Fetch all data from API
        const res = await fetch(PROFILE_API, {
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        let data = await res.json();
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
            data = data.content || data.data || [];
        }

        profileItems = data;

        // Client-side filtering
        if (companyName || description || fileTypeFilter) {
            profileItems = profileItems.filter(p => {
                const matchCompanyName = !companyName || 
                    (p.companyName || "").toLowerCase().includes(companyName.toLowerCase());
                const matchDescription = !description || 
                    (p.description || "").toLowerCase().includes(description.toLowerCase());
                const matchFileType = !fileTypeFilter || 
                    (p.fileType || "") === fileTypeFilter;
                return matchCompanyName && matchDescription && matchFileType;
            });
        }

        // Sort by company name
        profileItems.sort((a, b) => {
            const A = (a.companyName || "").toLowerCase();
            const B = (b.companyName || "").toLowerCase();
            return sortCompanyNameAsc ? A.localeCompare(B) : B.localeCompare(A);
        });

        totalElements = profileItems.length;
        totalPages = Math.ceil(totalElements / pageSize) || 1;

        renderProfileTable(paginateClient(profileItems, currentPage));
        renderPagination();
    } catch (err) {
        console.error("Lỗi tải profiles:", err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

function paginateClient(arr, page) {
    const start = page * pageSize;
    return (arr || []).slice(start, start + pageSize);
}

async function saveProfile() {
    const idVal = document.getElementById("profileId")?.value;
    const companyName = (document.getElementById("profileCompanyName")?.value || "").trim();
    const description = (document.getElementById("profileDescription")?.value || "").trim();

    if (!companyName) {
        alert("Vui lòng nhập tên công ty");
        return;
    }

    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append("companyName", companyName);
    if (description) {
        formData.append("description", description);
    }

    // Only include file if a new file was selected
    if (selectedFile) {
        formData.append("file", selectedFile);
    }

    console.log("Sending FormData to server:", {
        companyName,
        description,
        hasFile: !!selectedFile,
        fileName: selectedFile?.name
    });

    try {
        const method = idVal ? "PUT" : "POST";
        const url = idVal ? `${PROFILE_API}/${idVal}` : PROFILE_API;

        const res = await fetch(url, {
            method,
            headers: {
                // Don't set Content-Type - browser will set it automatically with boundary for FormData
                "Authorization": `Bearer ${TOKEN}`
            },
            body: formData
        });

        const text = await res.text().catch(() => null);
        let body = null;
        try {
            body = text ? JSON.parse(text) : null;
        } catch (e) {
            body = text;
        }

        console.log("Server response:", res.status, body);

        if (!res.ok) {
            throw new Error(body?.message || body || `Server ${res.status}`);
        }

        alert(idVal ? "✅ Cập nhật thành công" : "✅ Thêm thành công");
        await fetchProfiles(currentPage);
        closeProfileForm();
    } catch (err) {
        console.error("Lỗi saveProfile:", err);
        alert("❌ Lỗi: " + err.message);
    }
}

async function editProfile(id) {
    try {
        // First, try to get from API by ID
        let profile = null;
        try {
            const res = await fetch(`${PROFILE_API}/${id}`, {
                headers: { "Authorization": `Bearer ${TOKEN}` }
            });
            if (res.ok) {
                profile = await res.json();
            }
        } catch (e) {
            console.log("Could not fetch by ID, searching in list");
        }

        // If not found, search in current list
        if (!profile) {
            profile = profileItems.find(p => p.id == id);
        }

        if (!profile) {
            throw new Error("Không tìm thấy hồ sơ");
        }

        if (document.getElementById("profileId")) {
            document.getElementById("profileId").value = profile.id ?? "";
        }
        if (document.getElementById("profileCompanyName")) {
            document.getElementById("profileCompanyName").value = profile.companyName ?? "";
        }
        if (document.getElementById("profileDescription")) {
            document.getElementById("profileDescription").value = profile.description ?? "";
        }

        // Show current file info
        if (profile.fileName) {
            const fileInfo = document.getElementById("fileInfo");
            const currentFileName = document.getElementById("currentFileName");
            if (fileInfo && currentFileName) {
                currentFileName.textContent = profile.fileName;
                fileInfo.style.display = "block";
            }
        }

        // Reset file input
        selectedFile = null;
        const fileInput = document.getElementById("profileFile");
        if (fileInput) fileInput.value = "";

        openProfileForm(false);
    } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi tải hồ sơ");
    }
}

async function deleteProfile(id) {
    if (!confirm("Bạn có chắc muốn xóa hồ sơ này?")) return;
    try {
        const res = await fetch(`${PROFILE_API}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        if (!res.ok) {
            const txt = await res.text().catch(() => null);
            throw new Error(txt || `Server ${res.status}`);
        }
        alert("✅ Xóa thành công");
        await fetchProfiles(currentPage);
    } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi xóa");
    }
}

function downloadFile(id) {
    // Find profile by ID
    const profile = profileItems.find(p => p.id == id);
    if (!profile || !profile.fileData) {
        alert("Không có file để tải xuống");
        return;
    }

    try {
        // Convert base64 to blob
        const byteCharacters = atob(profile.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: profile.fileType || "application/octet-stream" });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = profile.fileName || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Lỗi download:", err);
        alert("❌ Lỗi khi tải xuống file");
    }
}

function renderProfileTable(items) {
    const tbody = document.getElementById("profileTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    (items || []).forEach(p => {
        // Format date: createdAt
        let createdAtStr = "";
        if (p.createdAt) {
            const date = new Date(p.createdAt);
            createdAtStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }

        // Format date: updatedAt
        let updatedAtStr = "";
        if (p.updatedAt) {
            const date = new Date(p.updatedAt);
            updatedAtStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        } else {
            updatedAtStr = "Chưa cập nhật";
        }

        // Get file type display name
        let fileTypeDisplay = p.fileType || "";
        if (fileTypeDisplay.includes("wordprocessingml")) {
            fileTypeDisplay = "Word (.docx)";
        } else if (fileTypeDisplay.includes("pdf")) {
            fileTypeDisplay = "PDF";
        } else if (fileTypeDisplay.includes("msword")) {
            fileTypeDisplay = "Word (.doc)";
        }

        tbody.innerHTML += `
            <tr>
                <td>${p.id ?? ""}</td>
                <td>${escapeHtml(p.companyName ?? "")}</td>
                <td>${escapeHtml(p.description ?? "")}</td>
                <td>${escapeHtml(p.fileName ?? "")}</td>
                <td>${escapeHtml(fileTypeDisplay)}</td>
                <td>${createdAtStr}</td>
                <td>${updatedAtStr}</td>
                <td>
                    ${p.fileData ? `<button class="btn btn-info btn-sm" onclick="downloadFile(${p.id})" title="Tải xuống"><i class="fas fa-download"></i></button>` : ''}
                    <button class="btn btn-warning btn-sm" onclick="editProfile(${p.id})" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProfile(${p.id})" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderPagination() {
    const container = document.getElementById("pagination");
    if (!container) return;
    container.innerHTML = "";
    totalPages = Number(totalPages) || Math.ceil((profileItems.length || totalElements) / pageSize);
    if (totalPages <= 1) return;
    const ul = document.createElement("ul");
    ul.className = "pagination";
    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage <= 0 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#">Prev</a>`;
    prev.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage > 0) fetchProfiles(currentPage - 1);
    });
    ul.appendChild(prev);
    const visible = 7;
    let start = Math.max(0, currentPage - Math.floor(visible / 2));
    let end = Math.min(totalPages - 1, start + visible - 1);
    if (end - start + 1 < visible) start = Math.max(0, end - visible + 1);
    for (let i = start; i <= end; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener("click", e => {
            e.preventDefault();
            if (i !== currentPage) fetchProfiles(i);
        });
        ul.appendChild(li);
    }
    const next = document.createElement("li");
    next.className = `page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`;
    next.innerHTML = `<a class="page-link" href="#">Next</a>`;
    next.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage < totalPages - 1) fetchProfiles(currentPage + 1);
    });
    ul.appendChild(next);
    container.appendChild(ul);
}

// Debounce helper
function debounce(fn, d = 300) {
    let t;
    return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), d);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProfiles(0);
    const deb = debounce(() => fetchProfiles(0), 350);
    ["searchCompanyName", "searchDescription", "filterFileType"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", deb);
            el.addEventListener("change", deb);
        }
    });
    const sortBtn = document.getElementById("sortCompanyNameBtn");
    if (sortBtn) {
        sortBtn.addEventListener("click", async () => {
            sortCompanyNameAsc = !sortCompanyNameAsc;
            await fetchProfiles(currentPage);
            const icon = sortBtn.querySelector("i");
            if (icon) icon.className = `fas fa-sort-alpha-${sortCompanyNameAsc ? "down" : "up"}`;
        });
    }
    const overlay = document.querySelector(".form-overlay");
    if (overlay) overlay.addEventListener("click", closeProfileForm);
});

