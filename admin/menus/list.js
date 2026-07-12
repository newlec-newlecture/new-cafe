/* ============================================
   관리자 - 메뉴 목록 로직
   ============================================ */

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryTabs();
  renderMenuList('all');

  // 탭 클릭 이벤트
  document.getElementById('categoryTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    currentCategory = btn.dataset.category;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderMenuList(currentCategory);
  });
});

function renderCategoryTabs() {
  const categories = getCategories();
  const container = document.getElementById('categoryTabs');
  container.innerHTML = `
    <button class="tab-btn active" data-category="all">전체</button>
    ${categories.map(c => `<button class="tab-btn" data-category="${c.id}">${c.name}</button>`).join('')}
  `;
}

function renderMenuList(category) {
  let menus = getMenus();

  if (category !== 'all') {
    menus = menus.filter(m => m.categoryId === Number(category));
  }

  const tbody = document.getElementById('menuTableBody');
  const emptyMsg = document.getElementById('emptyMessage');

  if (menus.length === 0) {
    tbody.innerHTML = '';
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  tbody.innerHTML = menus.map((menu) => {
    const cat = getCategoryById(menu.categoryId);
    const catName = cat ? cat.name : '-';
    const statusBadge = menu.available
      ? '<span class="badge badge-success">판매중</span>'
      : '<span class="badge badge-warning">품절</span>';

    return `
      <tr>
        <td class="menu-name">
          <a href="detail.html?id=${menu.id}">${menu.name}</a>
        </td>
        <td><span class="category-label">${catName}</span></td>
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
        renderMenuList(currentCategory);
      }
    });
  });
}
