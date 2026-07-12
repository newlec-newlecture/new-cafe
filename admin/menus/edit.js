/* ============================================
   관리자 - 메뉴 수정 (edit.js)
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

  // 카테고리 드롭다운 채우기
  const categories = getCategories();
  const select = document.getElementById('category');
  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.name;
    select.appendChild(option);
  });

  // 폼에 기존 데이터 채우기
  document.getElementById('menuId').value = menu.id;
  document.getElementById('category').value = menu.categoryId;
  document.getElementById('name').value = menu.name;
  document.getElementById('price').value = menu.price;
  document.getElementById('description').value = menu.description || '';
  document.getElementById('image').value = menu.image || '';
  document.getElementById('available').checked = menu.available;

  document.getElementById('pageTitle').textContent = `'${menu.name}' 수정`;
  document.getElementById('editForm').style.display = 'block';

  // 폼 제출
  document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedMenu = {
      categoryId: Number(document.getElementById('category').value),
      name: document.getElementById('name').value.trim(),
      price: Number(document.getElementById('price').value),
      description: document.getElementById('description').value.trim(),
      image: document.getElementById('image').value.trim(),
      available: document.getElementById('available').checked,
    };

    if (!updatedMenu.name || !updatedMenu.categoryId) {
      showToast('카테고리와 상품명은 필수입니다.', 'warning');
      return;
    }

    updateMenu(id, updatedMenu);
    showToast(`'${updatedMenu.name}' 메뉴가 수정되었습니다.`, 'success');
    location.href = `detail.html?id=${id}`;
  });
});
