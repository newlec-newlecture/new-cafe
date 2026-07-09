// menus/detail.js — 고객 메뉴 상세 페이지
(function () {
  const params = new URLSearchParams(window.location.search);
  const menuId = params.get('id');
  if (!menuId) { location.href = 'list.html'; return; }

  const menu = getMenuById(menuId);
  const detailEl = document.getElementById('menuDetail');
  const notFoundEl = document.getElementById('menuNotFound');

  if (!menu) {
    detailEl.style.display = 'none';
    notFoundEl.style.display = 'block';
    return;
  }

  var categories = getCategories();
  var cat = categories.find(function (c) { return c.id === menu.categoryId; });
  var catName = cat ? cat.name : '-';
  var emoji = getEmojiForCategory(menu.categoryId);

  if (!menu.available) {
    detailEl.innerHTML = `
      <div class="out-of-stock">
        <span class="badge badge-danger" style="font-size:1rem;">품절</span>
        <h2 style="margin: var(--space-md) 0;">${menu.name}</h2>
        <p style="color: var(--color-text-light);">현재 주문이 불가합니다.</p>
        <a href="list.html" class="btn btn-secondary" style="margin-top: var(--space-lg);">← 다른 메뉴 보기</a>
      </div>
    `;
    return;
  }

  var quantity = 1;

  function render() {
    detailEl.innerHTML = `
      ${menu.image
        ? `<img src="${menu.image}" alt="${menu.name}" class="detail-image">`
        : `<div class="detail-placeholder">${emoji}</div>`}
      <span class="detail-category">${catName}</span>
      <h1 class="detail-name">${menu.name}</h1>
      <p class="detail-price">${formatPrice(menu.price)}</p>
      ${menu.description ? `<p class="detail-description">${menu.description}</p>` : ''}
      ${menu.calories ? `
      <div class="detail-info">
        <span>🔥 ${menu.calories}kcal</span>
      </div>` : ''}

      <div class="quantity-selector">
        <label>수량</label>
        <button id="qtyMinus">−</button>
        <span id="qtyValue">${quantity}</span>
        <button id="qtyPlus">+</button>
      </div>

      <div class="detail-actions">
        <button id="addToCartBtn" class="btn btn-primary">🛒 장바구니에 추가</button>
        <a href="list.html" class="btn btn-secondary">← 목록</a>
      </div>
    `;

    // 이벤트 바인딩
    document.getElementById('qtyMinus').addEventListener('click', function () {
      if (quantity > 1) {
        quantity--;
        document.getElementById('qtyValue').textContent = quantity;
      }
    });

    document.getElementById('qtyPlus').addEventListener('click', function () {
      quantity++;
      document.getElementById('qtyValue').textContent = quantity;
    });

    document.getElementById('addToCartBtn').addEventListener('click', function () {
      for (var i = 0; i < quantity; i++) {
        addToCart(menu.id, menu.name, menu.price);
      }
      showToast(quantity + '개가 장바구니에 추가되었습니다', 'success');
    });
  }

  render();

  function getEmojiForCategory(catId) {
    var emojis = { 1: '☕', 2: '🍵', 3: '🥤', 4: '🍰', 5: '🍟' };
    return emojis[catId] || '☕';
  }
})();
