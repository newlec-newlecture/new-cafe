/* ============================================
   고객 - 메뉴 목록 (list.js)
   ============================================ */

let currentCategory = 0; // 0 = 전체

document.addEventListener('DOMContentLoaded', () => {
  // URL에서 카테고리 파라미터 읽기 (예: list.html?category=2)
  const urlCategory = getUrlParam('category');
  if (urlCategory) {
    currentCategory = Number(urlCategory);
  }

  renderCategoryTabs();
  if (urlCategory) {
    // 해당 카테고리 탭을 active로 설정
    const targetBtn = document.querySelector(`.category-tabs .tab[data-category="${currentCategory}"]`);
    if (targetBtn) {
      document.querySelectorAll('.category-tabs .tab').forEach(t => t.classList.remove('active'));
      targetBtn.classList.add('active');
    }
  }
  renderMenuGrid();
  updateCartBadge();
});

/**
 * 카테고리 탭 렌더링
 */
function renderCategoryTabs() {
  const categories = getCategories();
  const tabsContainer = document.getElementById('categoryTabs');

  categories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.category = c.id;
    btn.textContent = c.name;
    btn.addEventListener('click', () => switchCategory(c.id, btn));
    tabsContainer.appendChild(btn);
  });

  // 전체 탭 클릭 이벤트
  const allTab = tabsContainer.querySelector('[data-category="0"]');
  if (allTab) {
    allTab.addEventListener('click', () => switchCategory(0, allTab));
  }
}

/**
 * 카테고리 전환
 */
function switchCategory(categoryId, btn) {
  currentCategory = Number(categoryId);

  // 탭 active 토글
  document.querySelectorAll('.category-tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  renderMenuGrid();
}

/**
 * 메뉴 그리드 렌더링
 */
function renderMenuGrid() {
  const menus = getMenus();
  const grid = document.getElementById('menuGrid');
  const emptyState = document.getElementById('emptyState');

  // 판매중인 메뉴만 필터
  let filtered = menus.filter(m => m.available);

  if (currentCategory !== 0) {
    filtered = filtered.filter(m => m.categoryId === currentCategory);
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach(menu => {
    const category = getCategoryById(menu.categoryId);
    const card = document.createElement('div');
    card.className = 'menu-card glass-card';
    card.innerHTML = `
      <div class="menu-card-header">
        <span class="menu-card-name">${menu.name}</span>
        <span class="menu-card-price">${formatPrice(menu.price)}</span>
      </div>
      <p class="menu-card-desc">${menu.description || ''}</p>
      <div class="menu-card-footer">
        <span class="category-label">${category ? category.name : ''}</span>
        <button class="add-cart-btn" onclick="event.stopPropagation(); handleAddToCart(${menu.id}, '${menu.name.replace(/'/g, "\\'")}', ${menu.price})">
          + 담기
        </button>
      </div>
    `;

    // 카드 클릭 → 상세 페이지
    card.addEventListener('click', () => {
      location.href = `detail.html?id=${menu.id}`;
    });

    grid.appendChild(card);
  });
}

/**
 * 장바구니 담기
 */
function handleAddToCart(menuId, name, price) {
  addToCart(menuId, name, price);
  showToast(`'${name}'이(가) 장바구니에 추가되었습니다.`, 'success');
  updateCartBadge();
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
