/* ============================================
   관리자 - 메뉴 추가 (create.js)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 카테고리 드롭다운 채우기
  const categories = getCategories();
  const select = document.getElementById('category');
  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.name;
    select.appendChild(option);
  });

  // 폼 제출
  document.getElementById('createForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const menu = {
      categoryId: Number(document.getElementById('category').value),
      name: document.getElementById('name').value.trim(),
      price: Number(document.getElementById('price').value),
      description: document.getElementById('description').value.trim(),
      image: document.getElementById('image').value.trim(),
      available: document.getElementById('available').checked,
    };

    if (!menu.name || !menu.categoryId) {
      showToast('카테고리와 상품명은 필수입니다.', 'warning');
      return;
    }

    const newMenu = addMenu(menu);
    showToast(`'${menu.name}' 메뉴가 등록되었습니다.`, 'success');
    location.href = `list.html`;
  });
});
