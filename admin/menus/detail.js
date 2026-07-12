/* ============================================
   관리자 - 메뉴 상세 (detail.js)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const id = getUrlParam('id');

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

  document.getElementById('menuName').textContent = menu.name;

  const statusBadge = menu.available
    ? '<span class="badge badge-success">판매중</span>'
    : '<span class="badge badge-danger">판매정지</span>';

  document.getElementById('menuDetail').innerHTML = `
    <div class="detail-row">
      <div class="detail-label">카테고리</div>
      <div class="detail-value">${category ? category.name : '미분류'}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">상품명</div>
      <div class="detail-value">${menu.name}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">가격</div>
      <div class="detail-value"><span class="price">${formatPrice(menu.price)}</span></div>
    </div>
    <div class="detail-row">
      <div class="detail-label">상태</div>
      <div class="detail-value">${statusBadge}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">설명</div>
      <div class="detail-value detail-description">${menu.description || '등록된 설명이 없습니다.'}</div>
    </div>
    <div class="detail-actions">
      <a href="edit.html?id=${menu.id}" class="btn btn-primary">✏️ 수정</a>
      <button class="btn btn-secondary" onclick="toggleAvailability(${menu.id})">
        ${menu.available ? '⛔ 판매정지' : '✅ 판매재개'}
      </button>
      <button class="btn btn-danger" onclick="handleDelete(${menu.id})">🗑️ 삭제</button>
    </div>
  `;
});

function toggleAvailability(id) {
  const menu = getMenuById(id);
  if (!menu) return;

  const menus = getMenus();
  const idx = menus.findIndex(m => m.id === id);
  if (idx > -1) {
    menus[idx].available = !menus[idx].available;
    localStorage.setItem('cafe_menus', JSON.stringify(menus));
    showToast(
      menus[idx].available ? '판매가 재개되었습니다.' : '판매가 정지되었습니다.',
      menus[idx].available ? 'success' : 'warning'
    );
    location.reload();
  }
}

function handleDelete(id) {
  if (!confirmDialog('정말 이 메뉴를 삭제하시겠습니까?')) return;
  deleteMenu(id);
  showToast('메뉴가 삭제되었습니다.', 'success');
  location.href = 'list.html';
}
