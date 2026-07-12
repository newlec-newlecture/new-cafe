/* 5단계: 고객 - 주문 상세 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('orderDetail');
  const orderId = getUrlParam('id');

  if (!isValidId(orderId)) {
    container.innerHTML = '<p class="not-found">주문을 찾을 수 없습니다.</p>';
    return;
  }

  const order = getOrderByOrderId(orderId);
  if (!order) {
    container.innerHTML = '<p class="not-found">주문을 찾을 수 없습니다.</p>';
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

  container.innerHTML = `
    <div class="order-detail-card">
      <div class="order-meta">
        <span class="order-id">#${order.id} 주문</span>
        <span class="order-status status-${order.status}">${statusLabels[order.status] || order.status}</span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item-row">
            <div>
              <span class="order-item-name">${item.name}</span>
              <span class="order-item-qty"> x${item.quantity}</span>
            </div>
            <span class="order-item-price">${formatPrice(item.price * item.quantity)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-total-section">
        <span>합계</span>
        <span>${formatPrice(order.total)}</span>
      </div>
      <div class="order-date-info">
        <p>주문일: ${formatDate(order.createdAt)}</p>
        ${order.updatedAt !== order.createdAt ? `<p>최종 수정: ${formatDate(order.updatedAt)}</p>` : ''}
      </div>
    </div>
  `;
});
