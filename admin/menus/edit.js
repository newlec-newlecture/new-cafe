// admin/menus/edit.js — 메뉴 수정 폼 처리
(function () {
  const params = new URLSearchParams(window.location.search);
  const menuId = params.get('id');
  if (!menuId) { location.href = 'list.html'; return; }

  const menu = getMenuById(menuId);
  if (!menu) {
    alert('메뉴를 찾을 수 없습니다.');
    location.href = 'list.html';
    return;
  }

  const form = document.getElementById('editForm');
  const categorySelect = document.getElementById('category');

  // 카테고리 목록 채우기
  const categories = getCategories();
  categories.forEach(function (cat) {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    if (cat.id === menu.categoryId) option.selected = true;
    categorySelect.appendChild(option);
  });

  // 기존 데이터로 폼 채우기
  document.getElementById('name').value = menu.name || '';
  document.getElementById('price').value = menu.price || '';
  document.getElementById('description').value = menu.description || '';
  document.getElementById('calories').value = menu.calories || '';
  document.getElementById('image').value = menu.image || '';
  document.getElementById('active').checked = !!menu.available;

  // 폼 제출
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const updated = {
      categoryId: Number(categorySelect.value),
      name: document.getElementById('name').value.trim(),
      price: Number(document.getElementById('price').value),
      description: document.getElementById('description').value.trim(),
      calories: document.getElementById('calories').value ? Number(document.getElementById('calories').value) : null,
      image: document.getElementById('image').value.trim(),
      available: document.getElementById('active').checked,
    };

    if (!updated.name || !updated.categoryId || !updated.price) {
      alert('필수 항목을 입력하세요.');
      return;
    }

    const result = updateMenu(menuId, updated);
    if (result) {
      alert('메뉴가 수정되었습니다.');
      location.href = 'list.html';
    } else {
      alert('수정 중 오류가 발생했습니다.');
    }
  });
})();
