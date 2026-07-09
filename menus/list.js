// menus/list.js — 고객 메뉴 목록 페이지
(function () {
  const grid = document.getElementById('menuGrid');
  const emptyMsg = document.getElementById('emptyMessage');
  const filterContainer = document.getElementById('categoryFilters');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentCategory = 'all';

  // 카테고리 필터 버튼 생성
  function renderCategoryFilters() {
    const categories = getCategories();
    categories.forEach(function (cat) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.category = cat.id;
      btn.textContent = cat.name;
      filterContainer.appendChild(btn);
      filterBtns.forEach(function (b) {
        if (b === btn || b.dataset.category === cat.id) {
          b.addEventListener('click', function () {
            setActiveFilter(cat.id);
          });
        }
      });
    });

    // 전체 버튼
    document.querySelector('[data-category="all"]').addEventListener('click', function () {
      setActiveFilter('all');
    });
  }

  function setActiveFilter(catId) {
    currentCategory = catId;
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.category === String(catId));
    });
    renderMenus();
  }

  // 메뉴 렌더링
  function renderMenus() {
    var menus = getMenus();
    var categories = getCategories();

    if (currentCategory !== 'all') {
      menus = menus.filter(function (m) { return m.categoryId === Number(currentCategory); });
    }

    if (menus.length === 0) {
      grid.innerHTML = '';
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';

    grid.innerHTML = menus.map(function (menu) {
      var cat = categories.find(function (c) { return c.id === menu.categoryId; });
      var catName = cat ? cat.name : '-';
      var disabledClass = !menu.available ? 'disabled' : '';
      var emoji = getEmojiForCategory(menu.categoryId);

      return `
        <div class="glass-card menu-card ${disabledClass}" onclick="location.href='detail.html?id=${menu.id}'">
          ${menu.image
            ? `<img src="${menu.image}" alt="${menu.name}" class="menu-card-image">`
            : `<div class="menu-card-placeholder">${emoji}</div>`}
          <span class="menu-card-category">${catName}</span>
          <h3>${menu.name}</h3>
          <span class="menu-card-price">${formatPrice(menu.price)}</span>
          ${menu.available
            ? `<div class="menu-card-actions" onclick="event.stopPropagation()">
                <button class="btn btn-primary btn-sm" onclick="addToCart(${menu.id}, '${menu.name.replace(/'/g, "\\'")}', ${menu.price}); showToast('장바구니에 추가되었습니다', 'success')">+ 장바구니</button>
              </div>`
            : '<span class="badge badge-danger">품절</span>'}
        </div>
      `;
    }).join('');
  }

  function getEmojiForCategory(catId) {
    var emojis = { 1: '☕', 2: '🍵', 3: '🥤', 4: '🍰', 5: '🍟' };
    return emojis[catId] || '☕';
  }

  // 초기화
  renderCategoryFilters();
  renderMenus();
})();
