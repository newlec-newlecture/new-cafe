// admin/menus/create.js — 메뉴 추가 폼 처리
(function () {
  const form = document.getElementById('createForm');
  const categorySelect = document.getElementById('category');

  // 카테고리 목록 채우기
  const categories = getCategories();
  categories.forEach(function (cat) {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });

  // 폼 제출
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const menu = {
      categoryId: Number(categorySelect.value),
      name: document.getElementById('name').value.trim(),
      price: Number(document.getElementById('price').value),
      description: document.getElementById('description').value.trim(),
      calories: document.getElementById('calories').value ? Number(document.getElementById('calories').value) : null,
      image: document.getElementById('image').value.trim(),
      available: document.getElementById('active').checked,
    };

    if (!menu.name || !menu.categoryId || !menu.price) {
      alert('필수 항목을 입력하세요.');
      return;
    }

    const newMenu = addMenu(menu);
    if (newMenu) {
      alert('메뉴가 추가되었습니다.');
      location.href = 'list.html';
    } else {
      alert('추가 중 오류가 발생했습니다.');
    }
  });
})();
