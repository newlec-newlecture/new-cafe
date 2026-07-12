/* ============================================
   고객 - 메뉴 상세 (detail.js)
   ============================================ */

let currentQty = 1;

document.addEventListener('DOMContentLoaded', () => {
  const id = getUrlParam('id');
  updateCartBadge();

  if (!isValidId(id)) {
    document.getElementById('menuNotFound').style.display = 'block';
    return;
  }

  const menu = getMenuById(id);
  if (!menu) {
    document.getElementById('menuNotFound').style.display = 'block';
    return;
  }

  const category = getCategoryById(menu.categoryId);

  document.getElementById('menuDetail').innerHTML = `
    <h2>${menu.name}</h2>
    <p class="detail-category">${category ? category.name : '미분류'}</p>
    <p class="detail-price">${formatPrice(menu.price)}</p>
    <p class="detail-description">${menu.description || '등록된 설명이 없습니다.'}</p>
    <div class="detail-actions">
      <div class="quantity-control">
        <button class="qty-btn" id="qtyMinus">−</button>
        <span class="qty-value" id="qtyValue">1</span>
        <button class="qty-btn" id="qtyPlus">+</button>
      </div>
      <button class="btn btn-primary" id="addToCartBtn">장바구니 담기</button>
    </div>
  `;

  // 수량 조작
  document.getElementById('qtyMinus').addEventListener('click', () => changeQty(-1));
  document.getElementById('qtyPlus').addEventListener('click', () => changeQty(1));
  document.getElementById('addToCartBtn').addEventListener('click', () => addToCartAction(menu.id, menu.name, menu.price));
});

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('qtyValue').textContent = currentQty;
}

function addToCartAction(menuId, name, price) {
  for (let i = 0; i < currentQty; i++) {
    addToCart(menuId, name, price);
  }
  showToast(`'${name}' ${currentQty}개가 장바구니에 추가되었습니다.`, 'success');
  currentQty = 1;
  document.getElementById('qtyValue').textContent = 1;
  updateCartBadge();
}

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
