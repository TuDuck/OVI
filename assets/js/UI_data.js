const API_URL_LEADER = "http://26.129.206.142:8080/api/featuredPerson?type=LEADER";
const API_URL_SERVICES = "http://26.129.206.142:8080/api/services";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyMzAwMDN9.RPI0R1UgVl3V4yuoXbm6I2H6xV8whs1DXy065i4kzXI";

/// leader.js ///
async function loadLeaders() {
  const container = document.getElementById("leader-list");
  if (!container) return;

  try {
    const response = await fetch(API_URL_LEADER, {
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu từ API");
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
        <div class="col-lg-3 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
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
  if (!container) return;

  try {
    const response = await fetch(API_URL_SERVICES, {
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu từ API");
    }

    const data = await response.json();

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

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
    container.innerHTML = `<p style="text-align:center;color:red;">Không thể tải danh sách dịch vụ.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadServices);
document.addEventListener("DOMContentLoaded", loadLeaders);