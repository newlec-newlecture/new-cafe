// admin/menus/detail.js — 관리자 메뉴 상세 페이지
(function () {
  const params = new URLSearchParams(window.location.search);
  const menuId = params.get('id');
  if (!menuId) { location.href = 'list.html'; return; }

  const menu = CafeData.getMenu(menuId);
  const detailEl = document.getElementById('menuDetail');
  const notFoundEl = document.getElementById('menuNotFound');
  const menuNameEl = document.getElementById('menuName');

  if (!menu) {
    detailEl.style.display = 'none';
    notFoundEl.style.display = 'block';
    return;
  }

  menuNameEl.textContent = menu.name;

  const statusBadge = menu.active
    ? '<span class="badge badge-success">판매중</span>'
    : '<span class="badge badge-danger">판매중지</span>';

  detailEl.innerHTML = `
    <div class="detail-grid">
      <div class="detail-field">
        <label>카테고리</label>
        <p>${menu.category || '-'}</p>
      </div>
      <div class="detail-field">
        <label>가격</label>
        <p>${CafeData.formatPrice(menu.price)}</p>
      </div>
      <div class="detail-field">
        <label>상태</label>
        <p>${statusBadge}</p>
      </div>
      <div class="detail-field full">
        <label>설명</label>
        <p>${menu.description || '-'}</p>
      </div>
      ${menu.calories ? `<div class="detail-field">
        <label>칼로리</label>
        <p>${menu.calories}kcal</p>
      </div>` : ''}
      ${menu.image ? `<div class="detail-field full">
        <label>이미지</label>
        <img src="${menu.image}" alt="${menu.name}" class="detail-image">
      </div>` : ''}
    </div>
    <div class="detail-actions">
      <a href="edit.html?id=${menuId}" class="btn btn-primary">✏️ 수정</a>
      <a href="list.html" class="btn btn-secondary">← 목록</a>
    </div>
  `;
})();
