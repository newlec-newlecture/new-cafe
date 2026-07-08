/* ============================================
   관리자 - 메뉴 목록 로직
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryFilters();
  renderMenuList('all');

  // 필터 클릭 이벤트
  document.querySelector('.filter-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const category = btn.dataset.category;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderMenuList(category);
  });
});

function renderCategoryFilters() {
  const categories = getCategories();
  const container = document.getElementById('categoryFilters');
  container.innerHTML = categories
    .map(c => `<button class="filter-btn" data-category="${c.id}">${c.name}</button>`)
    .join('');
}

function renderMenuList(category) {
  let menus = getMenus();

  if (category !== 'all') {
    menus = menus.filter(m => m.categoryId === Number(category));
  }

  const tbody = document.getElementById('menuListBody');

  if (menus.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">메뉴가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = menus.map((menu, i) => {
    const cat = getCategoryById(menu.categoryId);
    const catName = cat ? cat.name : '-';
    const statusBadge = menu.available
      ? '<span class="badge badge-success">판매중</span>'
      : '<span class="badge badge-warning">품절</span>';

    return `
      <tr>
        <td>${i + 1}</td>
        <td><span class="category-label">${catName}</span></td>
        <td class="menu-name">
          <a href="detail.html?id=${menu.id}">${menu.name}</a>
        </td>
        <td class="price">${formatPrice(menu.price)}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="action-btns">
            <a href="edit.html?id=${menu.id}" class="btn btn-secondary btn-sm">수정</a>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${menu.id}">삭제</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // 삭제 버튼 바인딩
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      if (confirmDialog('정말 이 메뉴를 삭제하시겠습니까?')) {
        deleteMenu(id);
        showToast('메뉴가 삭제되었습니다.', 'success');
        renderMenuList(category);
      }
    });
  });
}
