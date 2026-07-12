/* ============================================
   관리자 - 주문 상세 (detail.js)
   ============================================ */

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
const STATUS_LABELS = {
  pending: '주문 대기',
  confirmed: '주문 확인',
  preparing: '준비중',
  ready: '출품 완료',
  completed: '완료',
  cancelled: '취소',
};

document.addEventListener('DOMContentLoaded', () => {
  const id = getUrlParam('id');

  if (!isValidId(id)) {
    document.getElementById('orderNotFound').style.display = 'block';
    return;
  }

  const order = getOrderByOrderId(id);
  if (!order) {
    document.getElementById('orderNotFound').style.display = 'block';
    return;
  }

  renderOrderDetail(order);
});

/**
 * 주문 상세 렌더링
 */
function renderOrderDetail(order) {
  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const statusClass = getStatusBadgeClass(order.status);

  document.getElementById('orderTitle').textContent = `#${order.id} 주문 상세`;

  // 품목 행 생성
  let itemsRows = '';
  order.items.forEach(item => {
    const subtotal = item.price * item.quantity;
    itemsRows += `
      <tr>
        <td class="col-name">${item.name}</td>
        <td class="col-qty">${item.quantity}</td>
        <td class="col-price">${formatPrice(item.price)}</td>
        <td class="col-subtotal">${formatPrice(subtotal)}</td>
      </tr>
    `;
  });

  // 상태 변경 버튼 생성
  let statusButtons = '';
  STATUS_FLOW.forEach(s => {
    const label = STATUS_LABELS[s];
    const cls = s === order.status ? 'status-btn active' : 'status-btn';
    statusButtons += `<button class="${cls}" data-status="${s}">${label}</button>`;
  });

  // 취소 버튼 (이미 취소된 주문에는 표시 안 함)
  if (order.status !== 'cancelled') {
    statusButtons += `<button class="status-btn" data-status="cancelled" style="border-color:var(--color-danger); color:var(--color-danger);">취소</button>`;
  }

  document.getElementById('orderDetail').innerHTML = `
    <div class="detail-row">
      <div class="detail-label">주문번호</div>
      <div class="detail-value">#${order.id}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">주문 시간</div>
      <div class="detail-value">${formatDate(order.createdAt)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">상태</div>
      <div class="detail-value"><span class="badge ${statusClass}">${statusLabel}</span></div>
    </div>

    <h3 style="margin: var(--space-md) 0;">품목 (${order.items.length})</h3>
    <table class="items-table">
      <thead>
        <tr>
          <th class="col-name">상품명</th>
          <th class="col-qty">수량</th>
          <th class="col-price">단가</th>
          <th class="col-subtotal">소계</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="detail-row" style="margin-top: var(--space-md);">
      <div class="detail-label">총 금액</div>
      <div class="detail-value" style="font-size:1.25rem; font-weight:700; color:var(--color-primary);">${formatPrice(order.total)}</div>
    </div>

    <h3 style="margin: var(--space-lg) 0 var(--space-md);">상태 변경</h3>
    <div class="status-change">
      ${statusButtons}
    </div>
  `;

  // 상태 변경 버튼 바인딩
  document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStatus = btn.dataset.status;
      if (newStatus === order.status) return;
      if (!confirmDialog(`주문 상태를 '${STATUS_LABELS[newStatus]}'(으)로 변경하시겠습니까?`)) return;

      updateOrderStatus(order.id, newStatus);
      showToast(`주문 상태가 '${STATUS_LABELS[newStatus]}'(으)로 변경되었습니다.`, 'success');
      renderOrderDetail(getOrderByOrderId(order.id));
    });
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
