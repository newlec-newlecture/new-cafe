/* ============================================
   고객 - 마이페이지 (index.js)
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
  updateCartBadge();
  renderStats();
  renderRecentOrders();
});

/**
 * 통계 렌더링
 */
function renderStats() {
  const orders = getOrders();
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, o) => sum + o.total, 0);
  const cartCount = getCartCount();

  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('totalAmount').textContent = formatPrice(totalAmount);
  document.getElementById('cartCount').textContent = cartCount + '개';
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
      location.href = `../orders/detail.html?id=${order.id}`;
    });
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

/**
 * 장바구니 배지 업데이트
 */
function updateCartBadge() {
  const count = getCartCount();
  const badge = document.getElementById('cartBadge');
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
    badge.style.background = 'var(--color-danger)';
    badge.style.color = '#fff';
  } else {
    badge.style.display = 'none';
  }
}
