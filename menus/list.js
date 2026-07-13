/* ============================================
   고객 - 메뉴 목록 (list.js)
   ============================================ */

let currentCategory = 0; // 0 = 전체
let searchKeyword = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 8;

document.addEventListener('DOMContentLoaded', () => {
  // URL에서 카테고리 파라미터 읽기 (예: list.html?category=2)
  const urlCategory = getUrlParam('category');
  if (urlCategory) {
    currentCategory = Number(urlCategory);
  }

  renderCategoryTabs();
  if (urlCategory) {
    const targetBtn = document.querySelector(`.category-tabs .tab[data-category="${currentCategory}"]`);
    if (targetBtn) {
      document.querySelectorAll('.category-tabs .tab').forEach(t => t.classList.remove('active'));
      targetBtn.classList.add('active');
    }
  }

  // 검색 바 이벤트
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.addEventListener('click', () => {
    searchKeyword = searchInput.value.trim();
    currentPage = 1;
    renderMenuGrid();
    renderPager();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  renderMenuGrid();
  renderPager();
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
  currentPage = 1;

  document.querySelectorAll('.category-tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  renderMenuGrid();
  renderPager();
}

/**
 * 필터링된 메뉴 목록 반환
 */
function getFilteredMenus() {
  const menus = getMenus();
  let filtered = menus.filter(m => m.available);

  if (currentCategory !== 0) {
    filtered = filtered.filter(m => m.categoryId === currentCategory);
  }

  if (searchKeyword) {
    const kw = searchKeyword.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(kw) ||
      (m.description && m.description.toLowerCase().includes(kw))
    );
  }

  return filtered;
}

/**
 * 메뉴 그리드 렌더링 (페이징 적용)
 */
function renderMenuGrid() {
  const filtered = getFilteredMenus();
  const grid = document.getElementById('menuGrid');
  const emptyState = document.getElementById('emptyState');

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  pageItems.forEach(menu => {
    const category = getCategoryById(menu.categoryId);
    const card = document.createElement('div');
    card.className = 'menu-card glass-card';
    card.innerHTML = `
      <div class="menu-card-image">
        <img src="${menu.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80'}" alt="${menu.name}" loading="lazy">
      </div>
      <div class="menu-card-body">
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
      </div>
    `;

    card.addEventListener('click', () => {
      location.href = `detail.html?id=${menu.id}`;
    });

    grid.appendChild(card);
  });
}

/**
 * 페이저 렌더링
 */
function renderPager() {
  const filtered = getFilteredMenus();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pager = document.getElementById('pager');

  pager.innerHTML = '';
  if (totalPages <= 1) return;

  // 이전 버튼
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pager-btn' + (currentPage === 1 ? ' disabled' : '');
  prevBtn.textContent = '‹';
  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  pager.appendChild(prevBtn);

  // 페이지 번호
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  pages.forEach(p => {
    if (p === '...') {
      const ell = document.createElement('span');
      ell.className = 'pager-ellipsis';
      ell.textContent = '⋯';
      pager.appendChild(ell);
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'pager-btn' + (p === currentPage ? ' active' : '');
    btn.textContent = p;
    btn.addEventListener('click', () => goToPage(p));
    pager.appendChild(btn);
  });

  // 다음 버튼
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pager-btn' + (currentPage === totalPages ? ' disabled' : '');
  nextBtn.textContent = '›';
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
  pager.appendChild(nextBtn);
}

/**
 * 페이지 이동
 */
function goToPage(page) {
  const filtered = getFilteredMenus();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderMenuGrid();
  renderPager();

  // 메뉴 그리드로 스크롤
  document.getElementById('menuGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
