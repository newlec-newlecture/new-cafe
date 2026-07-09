// basket/list.js — 장바구니 페이지 로직
(function () {
  var cartListEl = document.getElementById('cartList');
  var cartEmptyEl = document.getElementById('cartEmpty');
  var cartSummaryEl = document.getElementById('cartSummary');
  var totalPriceEl = document.getElementById('totalPrice');
  var clearBtn = document.getElementById('clearBtn');
  var orderBtn = document.getElementById('orderBtn');

  function render() {
    var cart = getCart();

    if (cart.length === 0) {
      cartListEl.innerHTML = '';
      cartEmptyEl.style.display = 'block';
      cartSummaryEl.style.display = 'none';
      return;
    }

    cartEmptyEl.style.display = 'none';
    cartSummaryEl.style.display = 'block';

    cartListEl.innerHTML = cart.map(function (item) {
      var subtotal = item.price * item.quantity;
      return `
        <div class="glass-card cart-item" data-menuId="${item.menuId}">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <span class="cart-item-price">${formatPrice(item.price)}</span>
          </div>
          <div class="cart-quantity">
            <button class="qty-minus">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-plus">+</button>
          </div>
          <span class="cart-subtotal" style="font-weight:700; min-width:80px; text-align:right;">${formatPrice(subtotal)}</span>
          <button class="btn btn-sm cart-remove">삭제</button>
        </div>
      `;
    }).join('');

    // 총계
    totalPriceEl.textContent = formatPrice(getCartTotal());

    // 이벤트 바인딩
    document.querySelectorAll('.cart-item').forEach(function (card) {
      var menuId = Number(card.dataset.menuId);

      card.querySelector('.qty-minus').addEventListener('click', function () {
        var cart = getCart();
        var item = cart.find(function (i) { return i.menuId === menuId; });
        if (item && item.quantity > 1) {
          item.quantity--;
          saveCart(cart);
        } else if (item && item.quantity <= 1) {
          removeFromCart(menuId);
        }
        render();
      });

      card.querySelector('.qty-plus').addEventListener('click', function () {
        updateCartQuantity(menuId, getCart().find(function (i) { return i.menuId === menuId; }).quantity + 1);
        render();
      });

      card.querySelector('.cart-remove').addEventListener('click', function () {
        if (confirm('정말 삭제하시겠습니까?')) {
          removeFromCart(menuId);
          render();
        }
      });
    });
  }

  // 전체 삭제
  clearBtn.addEventListener('click', function () {
    if (confirm('장바구니를 비우시겠습니까?')) {
      clearCart();
      render();
    }
  });

  // 주문하기
  orderBtn.addEventListener('click', function () {
    if (confirm('주문하시겠습니까?')) {
      var cart = getCart();
      if (cart.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
      }
      createOrder(cart, 'pending');
      showToast('주문이 완료되었습니다!', 'success');
      render();
      setTimeout(function () {
        location.href = '../orders/list.html';
      }, 1000);
    }
  });

  // 초기 렌더
  render();
})();
