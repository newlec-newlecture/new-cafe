/* ============================================
   고객 - 메인 페이지 (index.js)
   ============================================ */

const categoryIcons = {
  '커피': '☕',
  '티': '🍵',
  '스무디': '🥤',
  '디저트': '🍰',
  '사이드': '🍟',
  'default': '📦'
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderPopularMenus();
  renderCategories();
});

/**
 * 인기 메뉴 렌더링 (판매중인 메뉴 중 상위 8개)
 */
function renderPopularMenus() {
  const menus = getMenus().filter(m => m.available).slice(0, 8);
  const grid = document.getElementById('popularGrid');

  if (menus.length === 0) {
    grid.innerHTML = '<p style="color:var(--color-text-muted); grid-column:1/-1; text-align:center;">등록된 메뉴가 없습니다.</p>';
    return;
  }

  menus.forEach(menu => {
    const category = getCategoryById(menu.categoryId);
    const card = document.createElement('div');
    card.className = 'menu-card glass-card';
    card.innerHTML = `
      <div class="menu-card-header">
        <span class="menu-card-name">${menu.name}</span>
        <span class="menu-card-price">${formatPrice(menu.price)}</span>
      </div>
      <p class="menu-card-desc">${menu.description || ''}</p>
    `;
    card.addEventListener('click', () => {
      location.href = `menus/detail.html?id=${menu.id}`;
    });
    grid.appendChild(card);
  });
}

/**
 * 카테고리 렌더링
 */
function renderCategories() {
  const categories = getCategories();
  const menus = getMenus();
  const grid = document.getElementById('categoryGrid');

  categories.forEach(cat => {
    const count = menus.filter(m => m.categoryId === cat.id && m.available).length;
    const icon = categoryIcons[cat.name] || categoryIcons['default'];

    const card = document.createElement('div');
    card.className = 'category-card glass-card';
    card.innerHTML = `
      <div class="cat-icon">${icon}</div>
      <p class="cat-name">${cat.name}</p>
      <p class="cat-count">${count}개</p>
    `;
    card.addEventListener('click', () => {
      location.href = `menus/list.html?category=${cat.id}`;
    });
    grid.appendChild(card);
  });
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
