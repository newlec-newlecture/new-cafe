/* ============================================
   고객 - 장바구니 (list.js)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();

  document.getElementById('clearBtn').addEventListener('click', handleClear);
  document.getElementById('orderBtn').addEventListener('click', handleOrder);
});

/**
 * 장바구니 렌더링
 */
function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartList');
  const emptyState = document.getElementById('emptyState');
  const summary = document.getElementById('cartSummary');

  container.innerHTML = '';

  if (cart.length === 0) {
    emptyState.style.display = 'block';
    summary.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  summary.style.display = 'block';

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item glass-card';
    div.innerHTML = `
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price-each">${formatPrice(item.price)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="qty-btn" data-id="${item.menuId}" data-action="minus">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.menuId}" data-action="plus">+</button>
        </div>
        <span class="cart-item-subtotal">${formatPrice(subtotal)}</span>
        <button class="remove-btn" data-id="${item.menuId}">삭제</button>
      </div>
    `;
    container.appendChild(div);
  });

  // 수량 버튼 이벤트 바인딩
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const menuId = Number(btn.dataset.id);
      const action = btn.dataset.action;
      const cartNow = getCart();
      const item = cartNow.find(i => i.menuId === menuId);
      if (item) {
        if (action === 'plus') {
          updateCartQuantity(menuId, item.quantity + 1);
        } else {
          if (item.quantity > 1) {
            updateCartQuantity(menuId, item.quantity - 1);
          }
        }
      }
      renderCart();
      updateCartBadge();
    });
  });

  // 삭제 버튼 이벤트 바인딩
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const menuId = Number(btn.dataset.id);
      removeFromCart(menuId);
      showToast('항목이 삭제되었습니다.', 'info');
      renderCart();
      updateCartBadge();
    });
  });

  // 합계 업데이트
  const total = getCartTotal();
  document.getElementById('totalPrice').textContent = formatPrice(total);
}

/**
 * 전체 삭제
 */
function handleClear() {
  if (!confirmDialog('장바구니를 모두 비우시겠습니까?')) return;
  clearCart();
  showToast('장바구니가 비워졌습니다.', 'info');
  renderCart();
  updateCartBadge();
}

/**
 * 주문하기
 */
function handleOrder() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('장바구니가 비어있습니다.', 'warning');
    return;
  }

  if (!confirmDialog(`총 ${formatPrice(getCartTotal())}로 주문하시겠습니까?`)) return;

  const order = createOrder(cart);
  showToast(`주문이 완료되었습니다! (주문번호: ${order.id})`, 'success');
  location.href = '../orders/list.html';
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
