/* ============================================
   메뉴/카테고리 데이터 — 카페 앱
   (localStorage 기반 CRUD)
   ============================================ */

const DEFAULT_CATEGORIES = [
  { id: 1, name: '커피', sort: 1 },
  { id: 2, name: '티', sort: 2 },
  { id: 3, name: '스무디', sort: 3 },
  { id: 4, name: '디저트', sort: 4 },
  { id: 5, name: '사이드', sort: 5 },
];

const DEFAULT_MENUS = [
  { id: 1, categoryId: 1, name: '아메리카노', price: 4000, description: '클래식 원베인 커피', image: '', available: true },
  { id: 2, categoryId: 1, name: '카페라테', price: 4500, description: '크리미한 라떼', image: '', available: true },
  { id: 3, categoryId: 1, name: '카푸치노', price: 4500, description: '부드러운 스팀밀크와 에스프레소', image: '', available: true },
  { id: 4, categoryId: 1, name: '바닐라 라테', price: 5000, description: '바닐라 시럽을 넣은 라떼', image: '', available: true },
  { id: 5, categoryId: 2, name: '그린티', price: 3500, description: '정장 녹차', image: '', available: true },
  { id: 6, categoryId: 2, name: '얼그레이', price: 3800, description: '베르가못 향의 홍차', image: '', available: true },
  { id: 7, categoryId: 3, name: '망고 스무디', price: 5500, description: '신선한 망고 스무디', image: '', available: true },
  { id: 8, categoryId: 3, name: '스트로베리 요거트', price: 5500, description: '딸기와 요거트의 만남', image: '', available: true },
  { id: 9, categoryId: 4, name: '초콜릿 케이크', price: 6000, description: '부드러운 다크 초콜릿 케이크', image: '', available: true },
  { id: 10, categoryId: 4, name: '크루아상', price: 3500, description: '바삭한 프렌치 크루아상', image: '', available: true },
  { id: 11, categoryId: 5, name: '감자칩', price: 2500, description: '바삭 감자칩', image: '', available: true },
  { id: 12, categoryId: 5, name: '쿠키 (2개)', price: 2000, description: '부드러운 초콜릿 칩 쿠키', image: '', available: true },
];

/**
 * 데이터 초기화 (localStorage가 비어있으면 기본값 설정)
 */
function initData() {
  if (!localStorage.getItem('cafe_categories')) {
    localStorage.setItem('cafe_categories', JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem('cafe_menus')) {
    localStorage.setItem('cafe_menus', JSON.stringify(DEFAULT_MENUS));
  }
}

/**
 * 카테고리 목록 조회
 */
function getCategories() {
  return JSON.parse(localStorage.getItem('cafe_categories') || '[]');
}

/**
 * 카테고리 단건 조회
 */
function getCategoryById(id) {
  return getCategories().find(c => c.id === Number(id));
}

/**
 * 카테고리 추가
 */
function addCategory(name) {
  const categories = getCategories();
  const newId = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;
  const newCategory = { id: newId, name, sort: categories.length + 1 };
  categories.push(newCategory);
  localStorage.setItem('cafe_categories', JSON.stringify(categories));
  return newCategory;
}

/**
 * 카테고리 수정
 */
function updateCategory(id, name) {
  const categories = getCategories();
  const idx = categories.findIndex(c => c.id === Number(id));
  if (idx > -1) {
    categories[idx].name = name;
    localStorage.setItem('cafe_categories', JSON.stringify(categories));
    return categories[idx];
  }
  return null;
}

/**
 * 카테고리 삭제
 */
function deleteCategory(id) {
  let categories = getCategories();
  categories = categories.filter(c => c.id !== Number(id));
  localStorage.setItem('cafe_categories', JSON.stringify(categories));
}

/**
 * 메뉴 목록 조회
 */
function getMenus() {
  return JSON.parse(localStorage.getItem('cafe_menus') || '[]');
}

/**
 * 메뉴 단건 조회
 */
function getMenuById(id) {
  return getMenus().find(m => m.id === Number(id));
}

/**
 * 카테고리별 메뉴 조회
 */
function getMenusByCategory(categoryId) {
  return getMenus().filter(m => m.categoryId === Number(categoryId));
}

/**
 * 메뉴 추가
 */
function addMenu(menu) {
  const menus = getMenus();
  const newId = menus.length ? Math.max(...menus.map(m => m.id)) + 1 : 1;
  const newMenu = { ...menu, id: newId };
  menus.push(newMenu);
  localStorage.setItem('cafe_menus', JSON.stringify(menus));
  return newMenu;
}

/**
 * 메뉴 수정
 */
function updateMenu(id, menu) {
  const menus = getMenus();
  const idx = menus.findIndex(m => m.id === Number(id));
  if (idx > -1) {
    menus[idx] = { ...menus[idx], ...menu };
    localStorage.setItem('cafe_menus', JSON.stringify(menus));
    return menus[idx];
  }
  return null;
}

/**
 * 메뉴 삭제
 */
function deleteMenu(id) {
  let menus = getMenus();
  menus = menus.filter(m => m.id !== Number(id));
  localStorage.setItem('cafe_menus', JSON.stringify(menus));
}

// 앱 시작 시 초기화
initData();
