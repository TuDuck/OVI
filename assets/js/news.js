/**
 * NEWS PAGE JAVASCRIPT
 * Fetch và hiển thị tin tức từ API
 * 
 * API Response Format:
 * {
 *   id: number,
 *   title: string,
 *   summary: string,
 *   content: string,
 *   author: string,
 *   imageData: string (base64),
 *   createdAt: string (ISO datetime),
 *   updatedAt: string (ISO datetime) | null,
 *   category: string (e.g., "Thời sự", "Công Nghệ"),
 *   featured: "Y" | "N",
 *   link: string | null (external link),
 *   status: number (1 = active, 0 = inactive),
 *   views: number
 * }
 */

const NEWS_API_URL = "http://26.129.206.142:8080/api/news";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraWVubnYiLCJpYXQiOjE3NjIyNDUyMTV9.jzCfBf85jOaH8Qn1JT7XStwFpaBLBdkDkQFW0IVVheQ";

// Pagination state
let currentPage = 1;
const itemsPerPage = 10;
let allNewsList = [];
let currentCategoryFilter = null;

// Categories mapping (có thể customize theo backend)
const CATEGORIES = {
  TECH: { name: "Công Nghệ", color: "#841421" },
  BUSINESS: { name: "Kinh Doanh", color: "#0066cc" },
  INDUSTRY: { name: "Ngành Nghề", color: "#28a745" },
  PARTNER: { name: "Đối Tác", color: "#ff9800" },
  EVENT: { name: "Sự Kiện", color: "#9c27b0" },
  NEWS: { name: "Thời sự", color: "#dc3545" },
  SOCIAL: { name: "Xã hội", color: "#17a2b8" },
  ECONOMY: { name: "Kinh tế", color: "#ffc107" },
  EDUCATION: { name: "Giáo dục", color: "#6f42c1" },
  HEALTH: { name: "Sức khỏe", color: "#20c997" }
};

// Fake news data for testing (remove when API is ready)
// Note: This is for fallback only, API should provide real data
const FAKE_NEWS = [
  {
    id: 1,
    title: "OVI Group ký kết hợp tác chiến lược với Oracle",
    summary: "BỆNH VIỆN ĐA KHOA TRIỆU SƠN LÀM VIỆC VỚI ĐOÀN CÔNG TÁC VIETINBANK, ORACLE VIỆT NAM VÀ CÔNG TY CỔ PHẦN CÔNG NGHỆ OVI VỀ GIẢI PHÁP CHUYỂN ĐỔI SỐ TRONG NGÀNH Y TẾ",
    content: "Sáng nay, Bệnh viện Đa khoa Triệu Sơn đã vinh dự đón tiếp và làm việc với đoàn công tác " +
    "gồm đại diện Trụ sở chính Ngân hàng VietinBank, VietinBank Chi Nhánh Sầm Sơn, Công ty Oracle Việt " +
    "Nam và Công ty Cổ phần Công nghệ OVI về chương trình tư vấn, hỗ trợ chuyển đổi số và giới thiệu giải " +
    "pháp kết nối ERP dành cho ngành y tế. "+
    "Tại buổi làm việc, đoàn công tác đã giới thiệu tổng quan giải pháp quản trị tổng thể ERP (Enterprise " +
    " Resource Planning) và nền tảng số hóa quản lý bệnh viện, tích hợp nhiều tiện ích , hướng tới mô hình " +
     " “Bệnh viện thông minh – Quản trị hiện đại – Phục vụ chuyên nghiệp”." +
     "Lãnh đạo Bệnh viện Đa khoa Triệu Sơn bày tỏ sự hân hạnh được làm việc và đánh giá cao tinh thần đồng hành" +
     "của VietinBank, Oracle Việt Nam và OVI trong việc đưa công nghệ số vào hoạt động y tế, góp phần nâng cao" +
     "hiệu quả quản lý, tối ưu quy trình làm việc và mang lại trải nghiệm tốt hơn cho người bệnh.",
    category: "Đối Tác",
    imageData: "\assets\img\news\TEST.jpg",
    author: "Admin",
    createdAt: "2025-11-28",
    views: 1234,
    featured: "Y",
    status: 1,
    link: "https://www.facebook.com/story.php?story_fbid=1407149581412861&id=100063534970463&rdid=eMwDMIg5NLRm2OEQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fp%2F1Bh3viYMNn%2F"
  },
  {
    id: 2,
    title: "Xu hướng ERP Cloud trong năm 2025",
    summary: "Các giải pháp ERP đám mây đang dần thay thế hệ thống truyền thống",
    content: "Chi tiết tin tức...",
    category: "Công Nghệ",
    imageData: "/assets/img/masonry-portfolio/masonry-portfolio-2.jpg",
    author: "Tech Team",
    createdAt: "2025-11-27",
    views: 856,
    featured: "Y",
    status: 1,
    link: null
  },
  {
    id: 3,
    title: "Hội thảo chuyển đổi số cho SME thành công rực rỡ",
    summary: "Hơn 500 doanh nghiệp tham dự và tìm hiểu giải pháp",
    content: "Chi tiết tin tức...",
    category: "Sự Kiện",
    imageData: "/assets/img/masonry-portfolio/masonry-portfolio-3.jpg",
    author: "Event Team",
    createdAt: "2025-11-26",
    views: 654,
    featured: "Y",
    status: 1,
    link: null
  },
  {
    id: 4,
    title: "Tầm quan trọng của quản trị dòng tiền trong doanh nghiệp",
    summary: "Làm thế nào để kiểm soát và tối ưu dòng tiền hiệu quả",
    content: "Chi tiết tin tức...",
    category: "Kinh Doanh",
    imageData: "/assets/img/services.jpg",
    author: "Finance Team",
    createdAt: "2025-11-25",
    views: 432,
    featured: "N",
    status: 1,
    link: null
  },
  {
    id: 5,
    title: "Giải pháp ERP cho ngành sản xuất",
    summary: "Tối ưu hóa quy trình sản xuất với công nghệ hiện đại",
    content: "Chi tiết tin tức...",
    category: "Ngành Nghề",
    imageData: "/assets/img/about.jpg",
    author: "Industry Team",
    createdAt: "2025-11-24",
    views: 789,
    featured: "N",
    status: 1,
    link: null
  },
  {
    id: 6,
    title: "AI và Machine Learning trong ERP",
    summary: "Ứng dụng trí tuệ nhân tạo vào hệ thống quản trị doanh nghiệp",
    content: "Chi tiết tin tức...",
    category: "Công Nghệ",
    imageData: "/assets/img/hero-bg.png",
    author: "AI Team",
    createdAt: "2025-11-23",
    views: 921,
    featured: "N",
    status: 1,
    link: null
  }
];

/**
 * Transform API response to match expected format
 * API Response Format: 
 * { 
 *   id, title, summary, content, author, imageData, createdAt, updatedAt,
 *   category, featured, link, status, views 
 * }
 */
function transformNewsData(apiData) {
  return apiData
    .filter(news => news.status === 1) // Only show active news (status = 1)
    .map((news, index) => {
      // Convert base64 imageData to data URL
      let imageUrl = '/assets/img/hero-bg.png'; // Fallback image
      
      if (news.imageData) {
        // Check if imageData already has data URL prefix
        imageUrl = news.imageData.startsWith('data:') 
          ? news.imageData 
          : `data:image/png;base64,${news.imageData}`;
      }

      // Extract summary from content if not provided (first 150 characters)
      let summary = news.summary || news.content || '';
      if (!news.summary && news.content) {
        // Remove HTML tags for summary
        summary = summary.replace(/<[^>]*>/g, '');
        summary = summary.substring(0, 150) + (summary.length > 150 ? '...' : '');
      }

      // Map category from API or use default
      // If category exists in CATEGORIES mapping, use the key; otherwise use as-is
      let categoryKey = null;
      if (news.category) {
        // Try to find matching category in CATEGORIES
        const matchedKey = Object.keys(CATEGORIES).find(
          key => CATEGORIES[key].name.toLowerCase() === news.category.toLowerCase()
        );
        categoryKey = matchedKey || news.category; // Use matched key or original value
      } else {
        // Fallback: assign based on index
        const categoryKeys = Object.keys(CATEGORIES);
        categoryKey = categoryKeys[index % categoryKeys.length];
      }

      // Convert featured field: "Y" -> true, "N" or null -> false
      const isFeatured = news.featured === "Y";

      // Use views from API or default to 0
      const viewCount = typeof news.views === 'number' ? news.views : 0;

      return {
        id: news.id,
        title: news.title || 'Không có tiêu đề',
        summary: summary || 'Không có mô tả',
        content: news.content || '',
        category: categoryKey,
        image: imageUrl,
        author: news.author || 'OVI Group',
        date: news.createdAt || new Date().toISOString(),
        views: viewCount,
        featured: isFeatured,
        link: news.link || null, // External link if provided
        status: news.status || 1
      };
    });
}

/**
 * Fetch news from API
 */
async function fetchNews() {
  try {
    console.log("🔄 Fetching news from API...");
    
    const response = await fetch(NEWS_API_URL, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Response received:", data);

    // Transform API data to expected format
    const transformedData = transformNewsData(data);
    console.log("✅ Data transformed:", transformedData);

    return transformedData;
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    // Fallback to fake data for testing
    console.warn("⚠️ Using fake data for testing");
    // Transform fake data to match expected format
    return transformNewsData(FAKE_NEWS);
  }
}

/**
 * Format date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format views count
 */
function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
}

/**
 * Get category info
 * @param {string} categoryKey - Category key or category name from API
 * @returns {object} - Category info with name and color
 */
function getCategoryInfo(categoryKey) {
  // If categoryKey exists in CATEGORIES, use it
  if (CATEGORIES[categoryKey]) {
    return CATEGORIES[categoryKey];
  }
  
  // If categoryKey is a Vietnamese category name, find matching entry
  const matchedKey = Object.keys(CATEGORIES).find(
    key => CATEGORIES[key].name.toLowerCase() === categoryKey.toLowerCase()
  );
  
  if (matchedKey) {
    return CATEGORIES[matchedKey];
  }
  
  // Otherwise, return categoryKey as-is with default color
  return { 
    name: categoryKey || 'Chưa phân loại', 
    color: "#841421" 
  };
}

/**
 * Render Breaking News
 */
function renderBreakingNews(newsList) {
  const container = document.getElementById("breaking-news-content");
  if (!container) return;

  // Get latest 5 news
  const breakingNews = newsList.slice(0, 5);
  
  const html = breakingNews.map(news => 
    `<span class="breaking-item">${news.title}</span>`
  ).join('');

  container.innerHTML = html;
}

/**
 * Render Hero Section
 */
function renderHeroSection(newsList) {
  const heroMain = document.getElementById("hero-main");
  const heroSide = document.getElementById("hero-side");
  
  if (!heroMain || !heroSide) return;

  // Get featured news
  const featuredNews = newsList.filter(n => n.featured);
  const mainNews = featuredNews[0];
  const sideNews = featuredNews.slice(1, 3);

  // Render main news
  if (mainNews) {
    const category = getCategoryInfo(mainNews.category);
    heroMain.innerHTML = `
      <img src="${mainNews.image}" alt="${mainNews.title}">
      <div class="hero-main-content">
        <span class="hero-category">${category.name}</span>
        <h2>${mainNews.title}</h2>
        <p>${mainNews.summary}</p>
        <div class="hero-meta">
          <span><i class="bi bi-calendar"></i> ${formatDate(mainNews.date)}</span>
          <span><i class="bi bi-eye"></i> ${formatViews(mainNews.views)} lượt xem</span>
          <span><i class="bi bi-person"></i> ${mainNews.author}</span>
        </div>
      </div>
    `;
    heroMain.style.cursor = "pointer";
    heroMain.onclick = () => openNewsDetail(mainNews.id);
  }

  // Render side news
  heroSide.innerHTML = sideNews.map(news => {
    const category = getCategoryInfo(news.category);
    return `
      <div class="hero-side-item" onclick="openNewsDetail(${news.id})">
        <img src="${news.image}" alt="${news.title}">
        <div class="hero-side-content">
          <span class="hero-category">${category.name}</span>
          <h3>${news.title}</h3>
          <div class="hero-meta">
            <span><i class="bi bi-calendar"></i> ${formatDate(news.date)}</span>
            <span><i class="bi bi-eye"></i> ${formatViews(news.views)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Category Grid with Pagination
 */
function renderCategoryGrid(newsList, categoryKey = null, page = 1) {
  const container = document.getElementById("category-grid");
  if (!container) return;

  // Filter by category if specified
  let filteredNews = categoryKey 
    ? newsList.filter(n => n.category === categoryKey)
    : newsList;

  // Skip featured news
  filteredNews = filteredNews.filter(n => !n.featured);

  if (filteredNews.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-newspaper"></i>
        <h3>Chưa có tin tức</h3>
        <p>Hiện tại chưa có tin tức nào trong mục này</p>
      </div>
    `;
    document.getElementById("pagination-container").innerHTML = '';
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);

  // Render news cards
  const html = paginatedNews.map(news => {
    const category = getCategoryInfo(news.category);
    return `
      <div class="news-card" onclick="openNewsDetail(${news.id})">
        <div class="news-card-image">
          <img src="${news.image}" alt="${news.title}">
          <span class="news-card-category">${category.name}</span>
        </div>
        <div class="news-card-content">
          <h3 class="news-card-title">${news.title}</h3>
          <p class="news-card-summary">${news.summary}</p>
          <div class="news-card-meta">
            <span class="news-card-date">
              <i class="bi bi-calendar"></i>
              ${formatDate(news.date)}
            </span>
            <span class="news-card-views">
              <i class="bi bi-eye"></i>
              ${formatViews(news.views)}
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  // Render pagination
  renderPagination(page, totalPages, filteredNews.length);
}

/**
 * Render Pagination
 */
function renderPagination(currentPage, totalPages, totalItems) {
  const container = document.getElementById("pagination-container");
  if (!container || totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '<ul class="pagination">';

  // Previous button
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${currentPage - 1}); return false;">
        <i class="bi bi-chevron-left"></i> Trước
      </a>
    </li>
  `;

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First page
  if (startPage > 1) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="goToPage(1); return false;">1</a>
      </li>
    `;
    if (startPage > 2) {
      html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
      </li>
    `;
  }

  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
    html += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="goToPage(${totalPages}); return false;">${totalPages}</a>
      </li>
    `;
  }

  // Next button
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${currentPage + 1}); return false;">
        Sau <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;

  html += '</ul>';

  // Add info text
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  html += `<div class="pagination-info">Hiển thị ${startItem}-${endItem} trong tổng số ${totalItems} tin tức</div>`;

  container.innerHTML = html;
}

/**
 * Go to specific page
 */
function goToPage(page) {
  if (page < 1) return;
  
  currentPage = page;
  renderCategoryGrid(allNewsList, currentCategoryFilter, currentPage);
  
  // Scroll to category section
  const categorySection = document.getElementById('category-section');
  if (categorySection) {
    categorySection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Render Popular Posts (Sidebar)
 */
function renderPopularPosts(newsList) {
  const container = document.getElementById("popular-posts");
  if (!container) return;

  // Sort by views and get top 5
  const popularNews = [...newsList]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const html = popularNews.map((news, index) => `
    <div class="popular-post" onclick="openNewsDetail(${news.id})">
      <div class="popular-post-number">${index + 1}</div>
      <div class="popular-post-image">
        <img src="${news.image}" alt="${news.title}">
      </div>
      <div class="popular-post-content">
        <h4>${news.title}</h4>
        <div class="popular-post-meta">
          <i class="bi bi-eye"></i> ${formatViews(news.views)} lượt xem
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * Render Hot Topics (Sidebar)
 */
function renderHotTopics(newsList) {
  const container = document.getElementById("hot-topics");
  if (!container) return;

  // Get unique categories
  const categories = [...new Set(newsList.map(n => n.category))];

  const html = categories.map(cat => {
    const category = getCategoryInfo(cat);
    const count = newsList.filter(n => n.category === cat).length;
    return `
      <a href="#" class="topic-tag" onclick="filterByCategory('${cat}'); return false;">
        ${category.name} (${count})
      </a>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Show loading skeleton
 */
function showLoading() {
  const containers = ['hero-main', 'hero-side', 'category-grid', 'popular-posts'];
  
  containers.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = `
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      `;
    }
  });
}

/**
 * Open news detail
 * @param {number} newsId - News ID
 */
function openNewsDetail(newsId) {
  console.log("Opening news detail:", newsId);
  
  // Find news by ID to check if it has external link
  const news = allNewsList.find(n => n.id === newsId);
  
  if (news && news.link) {
    // If external link exists, open it in new tab
    window.open(news.link, '_blank', 'noopener,noreferrer');
  } else {
    // Otherwise, navigate to detail page (to be implemented)
    // window.location.href = `/news-detail.html?id=${newsId}`;
    alert(`Chi tiết tin tức ID: ${newsId}\n(Tính năng đang phát triển)`);
  }
}

/**
 * Filter by category
 */
function filterByCategory(categoryKey) {
  console.log("Filtering by category:", categoryKey);
  
  currentCategoryFilter = categoryKey;
  currentPage = 1; // Reset to first page
  
  // Re-render with filter
  renderCategoryGrid(allNewsList, categoryKey, currentPage);
  
  // Scroll to category grid
  document.getElementById('category-section').scrollIntoView({ 
    behavior: 'smooth' 
  });
}

/**
 * Main initialization
 */
async function loadNewsPage(categoryFilter = null) {
  try {
    // Show loading
    if (!categoryFilter) {
      showLoading();
    }

    // Fetch news
    const newsList = await fetchNews();

    if (!newsList || newsList.length === 0) {
      console.warn("No news data available");
      return;
    }

    // Store news list globally for pagination
    allNewsList = newsList;
    currentCategoryFilter = categoryFilter;
    currentPage = 1; // Reset to first page

    // Render sections
    renderBreakingNews(newsList);
    renderHeroSection(newsList);
    renderCategoryGrid(newsList, categoryFilter, currentPage);
    renderPopularPosts(newsList);
    renderHotTopics(newsList);

    console.log("✅ News page loaded successfully");
  } catch (error) {
    console.error("Error loading news page:", error);
    
    // Show error message
    const container = document.getElementById("category-grid");
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-exclamation-triangle"></i>
          <h3>Không thể tải tin tức</h3>
          <p>Vui lòng thử lại sau</p>
        </div>
      `;
    }
  }
}

// Auto load when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadNewsPage();
});

// Export functions for global access
window.openNewsDetail = openNewsDetail;
window.filterByCategory = filterByCategory;
window.goToPage = goToPage;

