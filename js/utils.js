/* ============================================
   공통 유틸리티 — 카페 앱
   ============================================ */

/**
 * 가격 포�팅 (천 단위 콤마)
 */
function formatPrice(price) {
  return Number(price).toLocaleString('ko-KR') + '원';
}

/**
 * 날짜 포�팅 (YYYY-MM-DD HH:mm)
 */
function formatDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${MM}-${DD} ${hh}:${mm}`;
}

/**
 * 날짜 포�팅 (간략: YYYY.MM.DD)
 */
function formatDateShort(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${MM}.${DD}`;
}

/* ---- 장바구니 (localStorage 기반) ---- */

/**
 * 장바구니 조회
 */
function getCart() {
  return JSON.parse(localStorage.getItem('cafe_cart') || '[]');
}

/**
 * 장바구니 저장
 */
function saveCart(cart) {
  localStorage.setItem('cafe_cart', JSON.stringify(cart));
}

/**
 * 장바구니에 항목 추가 (이미 있으면 수량 증가)
 */
function addToCart(menuId, name, price) {
  const cart = getCart();
  const exist = cart.find(item => item.menuId === Number(menuId));
  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({ menuId: Number(menuId), name, price: Number(price), quantity: 1 });
  }
  saveCart(cart);
  return cart;
}

/**
 * 장바구니 항목 삭제
 */
function removeFromCart(menuId) {
  let cart = getCart();
  cart = cart.filter(item => item.menuId !== Number(menuId));
  saveCart(cart);
  return cart;
}

/**
 * 장바구니 수량 변경
 */
function updateCartQuantity(menuId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.menuId === Number(menuId));
  if (item) {
    item.quantity = Math.max(1, Number(quantity));
    saveCart(cart);
  }
  return cart;
}

/**
 * 장바구니 전체 삭제
 */
function clearCart() {
  localStorage.setItem('cafe_cart', '[]');
}

/**
 * 장바구니 총 금액
 */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * 장바구니 항목 수
 */
function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/* ---- 주문 (localStorage 기반) ---- */

/**
 * 주문 목록 조회
 */
function getOrders() {
  return JSON.parse(localStorage.getItem('cafe_orders') || '[]');
}

/**
 * 주문 단건 조회
 */
function getOrderByOrderId(orderId) {
  return getOrders().find(o => o.id === Number(orderId));
}

/**
 * 주문 생성 (장바구니에서)
 */
function createOrder(items, status = 'pending') {
  const orders = getOrders();
  const newId = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const newOrder = {
    id: newId,
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status,          // pending | confirmed | preparing | ready | completed | cancelled
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem('cafe_orders', JSON.stringify(orders));
  // 주문 생성 후 장바구니 비우기
  clearCart();
  return newOrder;
}

/**
 * 주문 상태 변경
 */
function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === Number(orderId));
  if (idx > -1) {
    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    localStorage.setItem('cafe_orders', JSON.stringify(orders));
    return orders[idx];
  }
  return null;
}

/* ---- UI 유틸 ---- */

/**
 * 확인 다이얼로그 (네이티브)
 */
function confirmDialog(message) {
  return confirm(message);
}

/**
 * 알림 (네이티브 alert 대체 — 토스트 스�일)
 */
function showToast(message, type = 'info') {
  // 기존 토스트 제거
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 24px; right: 24px; z-index: 9999;
    padding: 12px 20px; border-radius: 8px; color: #fff;
    font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;

  const colors = {
    info: '#2196F3', success: '#4CAF50', warning: '#FF9800', danger: '#E53935',
  };
  toast.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * URL 파라미터 조회
 */
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * 숫자 ID가 유효한지 확인
 */
function isValidId(id) {
  return id !== null && id !== undefined && !isNaN(Number(id));
}
