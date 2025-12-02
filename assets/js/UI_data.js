const API_URL_LEADER = "http://26.129.206.142:8080/api/featuredPerson?type=LEADER";
const API_URL_SERVICES = "http://26.129.206.142:8080/api/services";
const API_URL_CLIENT = "http://26.129.206.142:8080/api/featuredPerson?type=CLIENT";
const API_URL_PROFILE = "http://26.129.206.142:8080/api/company-profile";

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

// Helper function to truncate text
function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/// leader.js ///
async function loadLeaders() {
  const container = document.getElementById("leader-list");
  if (!container) return;

  try {
    const response = await fetch(API_URL_LEADER, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.API_TOKEN}`
      }
    });

    if (!response.ok) {
      // Nếu 401/403 - token hết hạn hoặc không hợp lệ
      if (response.status === 401 || response.status === 403) {
        console.error("Authentication failed. Token may be expired.");
        if (window.AuthHelper) {
          window.AuthHelper.removeToken();
        }
      }
      throw new Error(`HTTP ${response.status}: Không thể tải dữ liệu từ API`);
    }

    const data = await response.json();

    container.innerHTML = data.map((item, index) => {
      // Nếu ảnh có tiền tố data:image/... thì dùng trực tiếp
      const imageSrc = item.imageData && item.imageData.startsWith("data:")
        ? item.imageData
        : `data:image/png;base64,${item.imageData}`;

      // Xử lý mô tả nhiều dòng thành <span>
      const descLines = item.description
        ? item.description.split("\n").map(line => `<span>${line.trim()}</span>`).join("")
        : "";

      return `
        <div class="team-member-col" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
          <div class="team-member">
            <div class="member-img">
              <img src="${imageSrc}" class="img-fluid" alt="${item.name}">
            </div>
            <div class="member-info">
              <h4>${item.name || "Chưa có tên"}</h4>
              ${descLines}
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu lãnh đạo:", error);
    container.innerHTML = `<p style="text-align:center;color:red;">Không thể tải danh sách ban lãnh đạo.</p>`;
  }
}

async function loadServices() {
  const container = document.getElementById("service-list");
  const dropdownContainer = document.getElementById("services-dropdown-list");

  try {
    const response = await fetch(API_URL_SERVICES, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.API_TOKEN}`
      }
    });

    if (!response.ok) {
      // Nếu 401/403 - token hết hạn hoặc không hợp lệ
      if (response.status === 401 || response.status === 403) {
        console.error("Authentication failed. Token may be expired.");
        if (window.AuthHelper) {
          window.AuthHelper.removeToken();
        }
      }
      throw new Error(`HTTP ${response.status}: Không thể tải dữ liệu từ API`);
    }

    const data = await response.json();

    // Render for service section
    if (container) {
      container.innerHTML = data.map((item, index) => {
        // Nếu imageData có dạng data:image/png;base64,... thì dùng trực tiếp
        const imageSrc = item.imageData && item.imageData.startsWith("data:")
          ? item.imageData
          : `data:image/png;base64,${item.imageData}`;

        return `
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${(index % 6) * 100}">
            <div class="service-item position-relative">
              <div class="icon">
                <i>
                  <img class="img-icon" src="${imageSrc}" alt="icon ${item.title}">
                </i>
              </div>
              <a href="#" class="stretched-link">
                <h3>${item.shortDescription || "Không có tiêu đề"}</h3>
              </a>
              <p>${item.description || "Chưa có mô tả"}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render for dropdown menu
    if (dropdownContainer) {
      dropdownContainer.innerHTML = data.map((item) => {
        const imageSrc = item.imageData && item.imageData.startsWith("data:")
          ? item.imageData
          : `data:image/png;base64,${item.imageData}`;

        // Escape and truncate text for safety and layout
        const title = escapeHtml(item.title || "Dịch vụ");
        const shortDesc = escapeHtml(item.shortDescription || "");

        return `
          <div class="col-lg-3 col-md-4 col-sm-6">
            <a href="#" class="service-item-dropdown">
              <div class="service-icon">
                <img src="${imageSrc}" alt="${escapeHtml(item.title || 'Service')}">
              </div>
              <div class="service-content">
                <h4 title="${title}">${title}</h4>
                <p title="${shortDesc}">${shortDesc}</p>
              </div>
            </a>
          </div>
        `;
      }).join('');
    }

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
    if (container) {
      container.innerHTML = `<p style="text-align:center;color:red;">Không thể tải danh sách dịch vụ.</p>`;
    }
    if (dropdownContainer) {
      dropdownContainer.innerHTML = `<div class="col-12 text-center"><p style="color:red;">Không thể tải dữ liệu</p></div>`;
    }
  }
}

async function loadClients() {
  const container = document.querySelector("#clients .swiper-wrapper");
  if (!container) return;

  try {
    const response = await fetch(API_URL_CLIENT, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.API_TOKEN}`
      }
    });

    if (!response.ok) {
      // Nếu 401/403 - token hết hạn hoặc không hợp lệ
      if (response.status === 401 || response.status === 403) {
        console.error("Authentication failed. Token may be expired.");
        if (window.AuthHelper) {
          window.AuthHelper.removeToken();
        }
      }
      throw new Error(`HTTP ${response.status}: Không thể tải dữ liệu từ API`);
    }

    const data = await response.json();

    container.innerHTML = data.map((item) => {
      // Nếu ảnh có tiền tố data:image/... thì dùng trực tiếp
      const imageSrc = item.imageData && item.imageData.startsWith("data:")
        ? item.imageData
        : `data:image/png;base64,${item.imageData}`;

      // Kiểm tra có link không
      const hasLink = item.link && item.link.trim() !== '';
      
      return `
        <div class="swiper-slide">
          ${hasLink ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">` : ''}
            <img src="${imageSrc}" class="img-fluid" alt="${item.name || 'Client'}" style="${hasLink ? 'cursor: pointer;' : ''}">
          ${hasLink ? '</a>' : ''}
        </div>
      `;
    }).join('');

    // Reinitialize Swiper sau khi load dữ liệu
    if (window.Swiper) {
      const swiperElement = document.querySelector("#clients .swiper");
      if (swiperElement && swiperElement.swiper) {
        swiperElement.swiper.update();
      }
    }

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu khách hàng:", error);
    container.innerHTML = `<div class="swiper-slide"><p style="text-align:center;color:red;">Không thể tải danh sách khách hàng.</p></div>`;
  }
}

async function downloadCompanyProfile() {
  const btn = event?.target?.closest('.btn-download-profile');
  const originalText = btn?.innerHTML;
  
  try {
    // Show loading indicator
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang tải...';
    }

    const response = await fetch(API_URL_PROFILE, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.API_TOKEN}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error("Authentication failed. Token may be expired.");
        if (window.AuthHelper) {
          window.AuthHelper.removeToken();
        }
      }
      throw new Error(`HTTP ${response.status}: Không thể tải dữ liệu từ API`);
    }

    let data = await response.json();
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      data = data.content || data.data || [];
    }

    // Get the first profile (or you can let user choose)
    if (!data || data.length === 0) {
      alert("Không tìm thấy hồ sơ công ty để tải xuống.");
      return;
    }

    const profile = data[0]; // Get first profile
    
    if (!profile.fileData) {
      alert("Hồ sơ không có file để tải xuống.");
      return;
    }

    // Convert base64 to blob (same logic as profileCompany.js)
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
    a.download = profile.fileName || "ho-so-cong-ty.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    if (btn) {
      btn.innerHTML = '<i class="bi bi-check-circle"></i> Tải thành công!';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    }

  } catch (error) {
    console.error("Lỗi khi tải hồ sơ công ty:", error);
    alert("Không thể tải xuống hồ sơ công ty. Vui lòng thử lại sau.");
    
    // Reset button
    const btn = event?.target?.closest('.btn-download-profile');
    if (btn && originalText) {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }
}

document.addEventListener("DOMContentLoaded", loadServices);
document.addEventListener("DOMContentLoaded", loadLeaders);
document.addEventListener("DOMContentLoaded", loadClients);