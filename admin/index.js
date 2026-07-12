/* ============================================
   관리자 - 대시보드 (index.js)
   ============================================ */

const STATUS_LABELS = {
  pending: '주문 대기',
  confirmed: '주문 확인',
  preparing: '준비중',
  ready: '출품 완료',
  completed: '완료',
  cancelled: '취소',
};

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderRecentOrders();
  renderCategorySummary();
});

/**
 * 대시보드 통계 렌더링
 */
function renderStats() {
  const menus = getMenus();
  const orders = getOrders();

  const totalMenus = menus.length;
  const activeMenus = menus.filter(m => m.available).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

  document.getElementById('totalMenus').textContent = totalMenus;
  document.getElementById('activeMenus').textContent = activeMenus;
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('pendingOrders').textContent = pendingOrders;
}

/**
 * 최근 주문 렌더링 (최신 5개)
 */
function renderRecentOrders() {
  const orders = getOrders().slice(-5).reverse();
  const container = document.getElementById('recentOrders');
  const noOrders = document.getElementById('noOrders');

  container.innerHTML = '';

  if (orders.length === 0) {
    noOrders.style.display = 'block';
    return;
  }

  noOrders.style.display = 'none';

  orders.forEach(order => {
    const statusLabel = STATUS_LABELS[order.status] || order.status;
    const statusClass = getStatusBadgeClass(order.status);

    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <div class="order-item-left">
        <span class="order-id">#${order.id} 주문</span>
        <span class="order-date">${formatDate(order.createdAt)} · <span class="badge ${statusClass}">${statusLabel}</span></span>
        <span class="order-date">${order.items.length}개 품목</span>
      </div>
      <div class="order-item-right">
        <p class="order-total">${formatPrice(order.total)}</p>
      </div>
    `;
    div.addEventListener('click', () => {
      location.href = `orders/detail.html?id=${order.id}`;
    });
    container.appendChild(div);
  });
}

/**
 * 카테고리 요약 렌더링
 */
function renderCategorySummary() {
  const categories = getCategories();
  const menus = getMenus();
  const container = document.getElementById('categorySummary');

  categories.forEach(cat => {
    const count = menus.filter(m => m.categoryId === cat.id).length;
    const available = menus.filter(m => m.categoryId === cat.id && m.available).length;

    const div = document.createElement('div');
    div.className = 'cat-stat glass-card';
    div.innerHTML = `
      <p class="cat-stat-name">${cat.name}</p>
      <p class="cat-stat-count">${count}개 (판매중 ${available}개)</p>
    `;
    container.appendChild(div);
  });
}

/**
 * 상태 배지 클래스
 */
function getStatusBadgeClass(status) {
  const map = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    preparing: 'badge-info',
    ready: 'badge-success',
    completed: 'badge-success',
    cancelled: 'badge-danger',
  };
  return map[status] || 'badge-info';
}
