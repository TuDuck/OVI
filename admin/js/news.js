/**
 * ADMIN NEWS MANAGEMENT
 * API Response Format:
 * {
 *   "id": 13,
 *   "title": "Tin cập nhật",
 *   "summary": "Tóm tắt cập nhật",
 *   "content": "Nội dung cập nhật",
 *   "author": "Admin",
 *   "imageData": "base64string...", // Base64 image without data URL prefix
 *   "createdAt": "2025-11-06T09:58:52.205299",
 *   "updatedAt": "2025-11-28T21:32:19.485099"
 * }
 */

const NEWS_API = "http://26.129.206.142:8080/api/news";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

let newsItems = [];
let sortTitleAsc = true;
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;

// image base64 for upload (stored with data URL prefix for preview)
let imageBase64 = null;

function openNewsForm(clear = true) {
    if (clear) clearNewsForm();
    document.getElementById("newsForm").classList.add("active");
    document.querySelector(".form-overlay").classList.add("active");
    document.body.style.overflow = 'hidden';
}

function closeNewsForm() {
    document.getElementById("newsForm").classList.remove("active");
    document.querySelector(".form-overlay").classList.remove("active");
    document.body.style.overflow = '';
}

function clearNewsForm() {
    const id = document.getElementById("newsId"); if (id) id.value = "";
    const t = document.getElementById("newsTitle"); if (t) t.value = "";
    const cat = document.getElementById("newsCategory"); if (cat) cat.value = "";
    const s = document.getElementById("newsSummary"); if (s) s.value = "";
    const c = document.getElementById("newsContent"); if (c) c.value = "";
    const a = document.getElementById("newsAuthor"); if (a) a.value = "";
    const feat = document.getElementById("newsFeatured"); if (feat) feat.value = "N";
    const status = document.getElementById("newsStatus"); if (status) status.value = "1";
    const views = document.getElementById("newsViews"); if (views) views.value = "0";
    const link = document.getElementById("newsLink"); if (link) link.value = "";
    imageBase64 = null;
    const preview = document.getElementById("newsImagePreview");
    if (preview) { preview.src = ""; preview.style.display = "none"; }
    const file = document.getElementById("newsImageFile");
    if (file) file.value = "";
}

// handle image file -> base64 preview
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("newsImageFile");
    if (fileInput) fileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        const preview = document.getElementById("newsImagePreview");
        if (!file) { imageBase64 = null; if (preview) preview.style.display = "none"; return; }
        const reader = new FileReader();
        reader.onload = () => {
            imageBase64 = reader.result; // data:image/...
            if (preview) { preview.src = imageBase64; preview.style.display = "block"; }
        };
        reader.readAsDataURL(file);
    });
});

async function fetchNews(page = 0) {
    currentPage = page; // Ghi nhớ trang hiện tại
    try {
        const title = document.getElementById("searchTitle")?.value?.trim() || "";
        const author = document.getElementById("searchAuthor")?.value?.trim() || "";
        const category = document.getElementById("filterCategory")?.value?.trim() || "";
        const status = document.getElementById("filterStatus")?.value?.trim() || "";
        const featured = document.getElementById("filterFeatured")?.value?.trim() || "";

        let url = `${NEWS_API}`;
        const params = new URLSearchParams();

        // Nếu có điều kiện tìm kiếm => dùng endpoint /search
        if (title || author) {
            if (title) params.append("title", title);
            if (author) params.append("author", author);
            params.append("page", page.toString());
            params.append("size", pageSize.toString());
            url = `${NEWS_API}/search?${params.toString()}`;
        } else {
            // Nếu không tìm kiếm => dùng /news?page=&size=
            params.append("page", page.toString());
            params.append("size", pageSize.toString());
            url = `${NEWS_API}?${params.toString()}`;
        }

        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        // Chuẩn hóa dữ liệu
        if (Array.isArray(data)) {
            newsItems = data;
            totalElements = newsItems.length;
            totalPages = Math.ceil(totalElements / pageSize);
        } else {
            newsItems = data.content || [];
            totalElements = data.totalElements || newsItems.length;
            totalPages = data.totalPages || Math.ceil(totalElements / pageSize);
            currentPage = data.number || page;
        }

        // 🔍 Lọc client-side (phòng khi backend chưa hỗ trợ filter)
        newsItems = newsItems.filter(n => {
            const matchTitle = !title || (n.title || "").toLowerCase().includes(title.toLowerCase());
            const matchAuthor = !author || (n.author || "").toLowerCase().includes(author.toLowerCase());
            const matchCategory = !category || (n.category || "") === category;
            const matchStatus = !status || (n.status !== undefined && n.status.toString() === status);
            const matchFeatured = !featured || (n.featured || "N") === featured;
            return matchTitle && matchAuthor && matchCategory && matchStatus && matchFeatured;
        });
        
        totalElements = newsItems.length;
        totalPages = Math.ceil(totalElements / pageSize);

        // 🔠 Sắp xếp theo title
        newsItems.sort((a, b) => {
            const A = (a.title || "").toLowerCase();
            const B = (b.title || "").toLowerCase();
            return sortTitleAsc ? A.localeCompare(B) : B.localeCompare(A);
        });

        renderNewsTable(paginateClient(newsItems, currentPage));
        renderPagination();
    } catch (err) {
        console.error("Lỗi tải news:", err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

function paginateClient(arr, page) {
    const start = page * pageSize;
    return (arr || []).slice(start, start + pageSize);
}


// fetch paged via /search (server should accept page & size & title/author) - check lỗi
// // async function fetchNews(page = 0) {
// //     try {
// //         const title = (document.getElementById("searchTitle")?.value || "").trim();
// //         const author = (document.getElementById("searchAuthor")?.value || "").trim();

// //         const params = new URLSearchParams();
// //         if (title) params.append("title", title);
// //         if (author) params.append("author", author);
// //         params.append("page", String(page));
// //         params.append("size", String(pageSize));

// //         const url = `${NEWS_API}/search?${params.toString()}`;
// //         const res = await fetch(url, { headers: { "Authorization": `Bearer ${TOKEN}`, "Accept": "application/json" } });

// //         if (!res.ok) {
// //             // Fallback to GET /news if needed
// //             const fallback = await fetch(NEWS_API, { headers: { "Authorization": `Bearer ${TOKEN}` } });
// //             if (!fallback.ok) throw new Error(`Server ${res.status}`);
// //             const j = await fallback.json();
// //             newsItems = Array.isArray(j) ? j : (j.content || []);
// //             totalElements = newsItems.length;
// //             totalPages = Math.ceil(totalElements / pageSize) || 1;
// //             currentPage = page;
// //             renderNewsTable(paginateClient(newsItems, page));
// //             renderPagination();
// //             return;
// //         }

// //         const json = await res.json();
// //         let items = [];
// //         if (Array.isArray(json)) {
// //             items = json;
// //             totalElements = items.length;
// //             totalPages = Math.ceil(totalElements / pageSize) || 1;
// //         } else if (json && Array.isArray(json.content)) {
// //             items = json.content;
// //             totalElements = json.totalElements ?? items.length;
// //             totalPages = json.totalPages ?? Math.ceil(totalElements / pageSize);
// //         } else {
// //             items = json ? (Array.isArray(json.data) ? json.data : []) : [];
// //             totalElements = items.length;
// //             totalPages = Math.ceil(totalElements / pageSize) || 1;
// //         }

// //         // Client sort by title
// //         items.sort((a, b) => {
// //             const A = (a.title || "").toLowerCase(), B = (b.title || "").toLowerCase();
// //             return sortTitleAsc ? A.localeCompare(B) : B.localeCompare(A);
// //         });

// //         newsItems = items;
// //         currentPage = Number(page);
// //         renderNewsTable(paginateClient(newsItems, page));
// //         renderPagination();
// //     } catch (err) {
// //         console.error("Lỗi tải news:", err);
// //     }
// // }

// function paginateClient(arr, page) {
//     const start = page * pageSize;
//     return (arr || []).slice(start, start + pageSize);
// }

async function saveNews() {
    const idVal = document.getElementById("newsId")?.value;
    const title = (document.getElementById("newsTitle")?.value || "").trim();
    const category = (document.getElementById("newsCategory")?.value || "").trim();
    const summary = (document.getElementById("newsSummary")?.value || "").trim();
    const content = (document.getElementById("newsContent")?.value || "").trim();
    const author = (document.getElementById("newsAuthor")?.value || "").trim();
    const featured = document.getElementById("newsFeatured")?.value || "N";
    const status = parseInt(document.getElementById("newsStatus")?.value || "1");
    const views = parseInt(document.getElementById("newsViews")?.value || "0");
    const link = (document.getElementById("newsLink")?.value || "").trim() || null;
    
    // Convert data URL to base64 only (remove the "data:image/...;base64," prefix)
    let imageData = null;
    if (imageBase64) {
        const match = imageBase64.match(/^data:image\/[^;]+;base64,(.+)$/);
        imageData = match ? match[1] : imageBase64;
    }

    // Build payload exactly as API expects (camelCase)
    const payload = { 
        title, 
        category, 
        summary, 
        content, 
        imageData, 
        author,
        featured,
        status,
        views,
        link
    };

    console.log("Sending payload to server:", payload);

    try {
        const method = idVal ? "PUT" : "POST";
        const url = idVal ? `${NEWS_API}/${idVal}` : NEWS_API;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        const text = await res.text().catch(() => null);
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }

        console.log("Server response:", res.status, body);

        if (!res.ok) {
            throw new Error(body?.message || body || `Server ${res.status}`);
        }

        alert(idVal ? "✅ Cập nhật thành công" : "✅ Thêm thành công");
        await fetchNews(currentPage);
        closeNewsForm();
    } catch (err) {
        console.error("Lỗi saveNews:", err);
        alert("❌ Lỗi: " + err.message);
    }
}

async function editNews(id) {
    try {
        const res = await fetch(`${NEWS_API}/${id}`, { headers: { "Authorization": `Bearer ${TOKEN}` } });
        if (!res.ok) throw new Error("Không tải được tin");
        const n = await res.json();
        if (document.getElementById("newsId")) document.getElementById("newsId").value = n.id ?? "";
        if (document.getElementById("newsTitle")) document.getElementById("newsTitle").value = n.title ?? "";
        if (document.getElementById("newsCategory")) document.getElementById("newsCategory").value = n.category ?? "";
        if (document.getElementById("newsSummary")) document.getElementById("newsSummary").value = n.summary ?? "";
        if (document.getElementById("newsContent")) document.getElementById("newsContent").value = n.content ?? "";
        if (document.getElementById("newsAuthor")) document.getElementById("newsAuthor").value = n.author ?? "";
        if (document.getElementById("newsFeatured")) document.getElementById("newsFeatured").value = n.featured ?? "N";
        if (document.getElementById("newsStatus")) document.getElementById("newsStatus").value = n.status ?? "1";
        if (document.getElementById("newsViews")) document.getElementById("newsViews").value = n.views ?? "0";
        if (document.getElementById("newsLink")) document.getElementById("newsLink").value = n.link ?? "";
        
        // Handle imageData (API returns base64 without data URL prefix)
        imageBase64 = null;
        if (n.imageData) {
            // If it's pure base64, add the data URL prefix
            imageBase64 = n.imageData.startsWith('data:') ? n.imageData : `data:image/png;base64,${n.imageData}`;
        }
        
        const preview = document.getElementById("newsImagePreview");
        if (imageBase64 && preview) { 
            preview.src = imageBase64; 
            preview.style.display = "block"; 
        } else if (preview) {
            preview.style.display = "none";
        }
        
        openNewsForm(false);
    } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi tải tin");
    }
}

async function deleteNews(id) {
    if (!confirm("Bạn có chắc muốn xóa tin này?")) return;
    try {
        const res = await fetch(`${NEWS_API}/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${TOKEN}` } });
        if (!res.ok) {
            const txt = await res.text().catch(()=>null);
            throw new Error(txt || `Server ${res.status}`);
        }
        alert("✅ Xóa thành công");
        await fetchNews(currentPage);
    } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi xóa");
    }
}

function renderNewsTable(items) {
    const tbody = document.getElementById("newsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    (items || []).forEach(n => {
        // Handle imageData (convert base64 to data URL if needed)
        let imgHtml = "";
        if (n.imageData) {
            const imgSrc = n.imageData.startsWith('data:') ? n.imageData : `data:image/png;base64,${n.imageData}`;
            imgHtml = `<img src="${imgSrc}" style="max-width:60px;max-height:60px;object-fit:cover;border-radius:4px">`;
        }
        
        // Format date: createdAt
        let dateStr = "";
        if (n.createdAt) {
            const date = new Date(n.createdAt);
            dateStr = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
        }
        
        // Truncate title
        const title = escapeHtml(n.title ?? "");
        const titleShort = title.length > 40 ? title.substring(0, 40) + '...' : title;
        
        // Truncate author
        const author = escapeHtml(n.author ?? "");
        const authorShort = author.length > 15 ? author.substring(0, 15) + '...' : author;
        
        // Featured badge (shorter)
        const featuredBadge = n.featured === 'Y' 
            ? '<span class="badge badge-warning" title="Tin nổi bật">⭐</span>' 
            : '<span class="badge badge-light" title="Tin thường">-</span>';
        
        // Status badge
        const statusBadge = n.status === 1 
            ? '<span class="badge badge-success">✓</span>' 
            : '<span class="badge badge-danger">✗</span>';
        
        // Category badge (shorter)
        const categoryShort = escapeHtml((n.category ?? "").substring(0, 10));
        
        tbody.innerHTML += `
            <tr>
                <td style="width: 50px;">${n.id ?? ""}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${title}">
                    ${titleShort}
                </td>
                <td style="width: 100px; text-align: center;">
                    <span class="badge badge-primary">${categoryShort}</span>
                </td>
                <td style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${author}">
                    ${authorShort}
                </td>
                <td style="width: 70px; text-align: center;">${featuredBadge}</td>
                <td style="width: 70px; text-align: center;">${statusBadge}</td>
                <td style="width: 80px; text-align: center;">${(n.views ?? 0).toLocaleString()}</td>
                <td style="width: 80px; text-align: center;">${imgHtml}</td>
                <td style="width: 100px; white-space: nowrap;">${dateStr}</td>
                <td style="width: 100px; white-space: nowrap;">
                    <button class="btn btn-info btn-sm" onclick="editNews(${n.id})" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteNews(${n.id})" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function escapeHtml(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function renderPagination() {
    const container = document.getElementById("pagination");
    if (!container) return;
    container.innerHTML = "";
    totalPages = Number(totalPages) || Math.ceil((newsItems.length || totalElements) / pageSize);
    if (totalPages <= 1) return;
    const ul = document.createElement("ul"); ul.className = "pagination";
    const prev = document.createElement("li"); prev.className = `page-item ${currentPage<=0?"disabled":""}`;
    prev.innerHTML = `<a class="page-link" href="#">Prev</a>`; prev.addEventListener("click", e=>{ e.preventDefault(); if (currentPage>0) fetchNews(currentPage-1); });
    ul.appendChild(prev);
    const visible = 7; let start = Math.max(0, currentPage - Math.floor(visible/2)); let end = Math.min(totalPages-1, start + visible -1);
    if (end - start + 1 < visible) start = Math.max(0, end - visible +1);
    for (let i=start;i<=end;i++){ const li=document.createElement("li"); li.className=`page-item ${i===currentPage?"active":""}`; li.innerHTML=`<a class="page-link" href="#">${i+1}</a>`; li.addEventListener("click", e=>{ e.preventDefault(); if (i!==currentPage) fetchNews(i); }); ul.appendChild(li); }
    const next = document.createElement("li"); next.className = `page-item ${currentPage>=totalPages-1?"disabled":""}`; next.innerHTML=`<a class="page-link" href="#">Next</a>`; next.addEventListener("click", e=>{ e.preventDefault(); if (currentPage<totalPages-1) fetchNews(currentPage+1); }); ul.appendChild(next);
    container.appendChild(ul);
}

// debounce helper
function debounce(fn, d=300){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), d); }; }

document.addEventListener("DOMContentLoaded", () => {
    fetchNews(0);
    const deb = debounce(()=>fetchNews(0), 350);
    ["searchTitle","searchAuthor","filterCategory","filterStatus","filterFeatured"].forEach(id=>{ 
        const el=document.getElementById(id); 
        if(el){ 
            el.addEventListener("input", deb); 
            el.addEventListener("change", deb); 
        }
    });
    const sortBtn = document.getElementById("sortTitleBtn");
    if (sortBtn) sortBtn.addEventListener("click", async ()=>{ sortTitleAsc = !sortTitleAsc; await fetchNews(currentPage); const icon = sortBtn.querySelector("i"); if (icon) icon.className = `fas fa-sort-alpha-${sortTitleAsc ? "down" : "up"}`; });
    const overlay = document.querySelector(".form-overlay"); if (overlay) overlay.addEventListener("click", closeNewsForm);
});