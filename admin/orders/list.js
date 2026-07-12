/* ============================================
   관리자 - 주문 목록 (list.js)
   ============================================ */

const STATUS_LABELS = {
  pending: '주문 대기',
  confirmed: '주문 확인',
  preparing: '준비중',
  ready: '출품 완료',
  completed: '완료',
  cancelled: '취소',
};

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderOrderList();
  bindStatusTabs();
});

/**
 * 상태 탭 바인딩
 */
function bindStatusTabs() {
  document.querySelectorAll('.status-tabs .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.status;
      document.querySelectorAll('.status-tabs .tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderOrderList();
    });
  });
}

/**
 * 주문 목록 렌더링
 */
function renderOrderList() {
  let orders = getOrders().slice().reverse(); // 최신순
  const container = document.getElementById('orderList');
  const emptyState = document.getElementById('emptyState');

  if (currentFilter !== 'all') {
    orders = orders.filter(o => o.status === currentFilter);
  }

  container.innerHTML = '';

  if (orders.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  orders.forEach(order => {
    const statusLabel = STATUS_LABELS[order.status] || order.status;
    const statusClass = getStatusBadgeClass(order.status);
    const itemNames = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');

    const div = document.createElement('div');
    div.className = 'order-item glass-card';
    div.innerHTML = `
      <div class="order-item-left">
        <span class="order-id">#${order.id} 주문</span>
        <span class="order-date">${formatDate(order.createdAt)}</span>
        <span class="order-items-preview">${itemNames}</span>
        <span class="badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="order-item-right">
        <p class="order-total">${formatPrice(order.total)}</p>
      </div>
    `;
    div.addEventListener('click', () => {
      location.href = `detail.html?id=${order.id}`;
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
