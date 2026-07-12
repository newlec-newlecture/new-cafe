/* 5단계: 고객 - 주문 내역 목록 */

document.addEventListener('DOMContentLoaded', () => {
  const orderListEl = document.getElementById('orderList');
  const orders = getOrders();

  if (orders.length === 0) {
    orderListEl.innerHTML = '<p class="empty-message">주문 내역이 없습니다.</p>';
    return;
  }

  const statusLabels = {
    pending: '대기중',
    confirmed: '확인됨',
    preparing: '준비중',
    ready: '준비완료',
    completed: '완료',
    cancelled: '취소됨'
  };

  const statusClass = {
    pending: 'status-pending',
    confirmed: 'status-completed',
    preparing: 'status-pending',
    ready: 'status-completed',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };

  orderListEl.innerHTML = orders.reverse().map(order => `
    <a href="detail.html?id=${order.id}" class="order-card">
      <div class="order-header">
        <span class="order-date">${formatDate(order.createdAt)}</span>
        <span class="order-status ${statusClass[order.status] || 'status-pending'}">${statusLabels[order.status] || order.status}</span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-total">
        <span>합계</span>
        <span>${formatPrice(order.total)}</span>
      </div>
    </a>
  `).join('');
});
