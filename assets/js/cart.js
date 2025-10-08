// assets/js/cart.js
(() => {
  const STORAGE_KEY = 'jekyll_cart_v1';

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      console.error('Cart load error', e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cart:updated', {detail: cart}));
  }

  function findItem(cart, id) {
    return cart.find(i => i.id === id);
  }

  function addToCart(item, qty = 1) {
    const cart = loadCart();
    const existing = findItem(cart, item.id);
    if (existing) {
      existing.qty = Math.min(999, existing.qty + qty);
    } else {
      cart.push(Object.assign({}, item, {qty: qty}));
    }
    saveCart(cart);
  }

  function updateQty(id, qty) {
    const cart = loadCart();
    const it = findItem(cart, id);
    if (!it) return;
    if (qty <= 0) {
      // remove
      const idx = cart.indexOf(it);
      cart.splice(idx, 1);
    } else {
      it.qty = Math.min(999, qty);
    }
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  function cartTotal(cart) {
    return cart.reduce((s, it) => s + (Number(it.price) * Number(it.qty)), 0);
  }

  function formatCurrency(amount, currency = 'GBP') {
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
    } catch (e) {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  // Render a small cart summary (e.g. header/minicart)
  function renderMiniCart(container) {
    const cart = loadCart();
    container.innerHTML = '';
    if (!cart.length) {
      container.innerHTML = '<em>Your cart is empty</em>';
      return;
    }
    const ul = document.createElement('ul');
    cart.forEach(it => {
      const li = document.createElement('li');
      li.textContent = `${it.title} × ${it.qty} — ${formatCurrency(it.price * it.qty, it.currency)}`;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    const total = document.createElement('div');
    total.className = 'cart-total';
    total.textContent = 'Total: ' + formatCurrency(cartTotal(cart), cart[0]?.currency || 'GBP');
    container.appendChild(total);
    const view = document.createElement('a');
    view.href = '/cart.html';
    view.textContent = 'View cart';
    container.appendChild(view);
  }

  // Render full cart page inside a given container element
  function renderCartPage(container) {
    const cart = loadCart();
    container.innerHTML = '';
    if (!cart.length) {
      container.innerHTML = '<p>Your cart is empty. <a href="/">Continue shopping</a></p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'cart-table';
    table.innerHTML = `
      <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Line</th><th></th></tr></thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    cart.forEach(it => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="cart-product">
            <img src="${it.img}" alt="${it.title}" style="max-width:60px;">
            <div>
              <strong>${it.title}</strong>
              <div class="small-desc">${it.description || ''}</div>
            </div>
          </div>
        </td>
        <td>${formatCurrency(Number(it.price), it.currency)}</td>
        <td><input class="cart-qty" data-id="${it.id}" type="number" min="0" value="${it.qty}" style="width:70px;"></td>
        <td>${formatCurrency(Number(it.price) * Number(it.qty), it.currency)}</td>
        <td><button class="remove-item" data-id="${it.id}">Remove</button></td>
      `;
      tbody.appendChild(row);
    });

    container.appendChild(table);

    const summary = document.createElement('div');
    summary.className = 'cart-summary';
    summary.innerHTML = `<p>Total: <strong>${formatCurrency(cartTotal(cart), cart[0]?.currency || 'GBP')}</strong></p>`;
    container.appendChild(summary);

    // Checkout options block
    const checkout = document.createElement('div');
    checkout.className = 'checkout-options';
    checkout.innerHTML = `
      <p>
        <button id="checkout-mailto">Checkout by email</button>
        <button id="clear-cart">Clear cart</button>
      </p>
      <p>
        <small>If you have a Stripe/PayPal payment link, paste it in the box below and click "Go to payment".</small><br>
        <input id="payment-link" type="text" placeholder="Paste Stripe/PayPal Payment Link here" style="width:60%;">
        <button id="goto-payment">Go to payment</button>
      </p>
    `;
    container.appendChild(checkout);

    // events
    container.querySelectorAll('.cart-qty').forEach(inp => {
      inp.addEventListener('change', e => {
        const id = e.target.dataset.id;
        const qty = parseInt(e.target.value) || 0;
        updateQty(id, qty);
        renderCartPage(container);
      });
    });
    container.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', e => {
        updateQty(e.target.dataset.id, 0);
        renderCartPage(container);
      });
    });
    container.querySelector('#clear-cart').addEventListener('click', () => {
      if (confirm('Clear your cart?')) {
        clearCart();
        renderCartPage(container);
      }
    });
    container.querySelector('#checkout-mailto').addEventListener('click', () => {
      const cart = loadCart();
      const lines = cart.map(it => `${it.title} × ${it.qty} — ${formatCurrency(it.price * it.qty, it.currency)}`);
      const body = encodeURIComponent(`Hello,\n\nI'd like to order:\n\n${lines.join('\n')}\n\nTotal: ${formatCurrency(cartTotal(cart), cart[0]?.currency || 'GBP')}\n\nShipping address:\n\nName:\nAddress:\n\nThank you.`);
      const subject = encodeURIComponent('Order from website');
      window.location.href = `mailto:you@yourshop.example?subject=${subject}&body=${body}`;
    });
    container.querySelector('#goto-payment').addEventListener('click', () => {
      const link = container.querySelector('#payment-link').value.trim();
      if (!link) return alert('Paste a payment link first (Stripe/PayPal).');
      window.open(link, '_blank');
    });
  }

  // Hook up product buttons
  function attachProductButtons(root = document) {
    root.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', e => {
        const card = e.target.closest('[data-product-id]');
        if (!card) return;
        const id = card.dataset.productId;
        const title = card.dataset.productTitle;
        const price = parseFloat(card.dataset.productPrice);
        const currency = card.dataset.productCurrency || 'GBP';
        const img = card.dataset.productImg || '';
        const desc = card.querySelector('.desc')?.textContent?.trim() || '';
        const qty = Math.max(1, parseInt(card.querySelector('.qty')?.value || 1));
        addToCart({ id, title, price, currency, img, description: desc }, qty);
        // flash or update mini cart if present
        const mini = document.querySelector('.mini-cart');
        if (mini) renderMiniCart(mini);
        // small UI feedback
        btn.textContent = 'Added';
        setTimeout(()=> btn.textContent = 'Add to cart', 900);
      });
    });
  }

  // Expose helpers globally
  window.JekyllCart = {
    loadCart,
    saveCart,
    addToCart,
    updateQty,
    clearCart,
    cartTotal,
    formatCurrency,
    renderMiniCart,
    renderCartPage,
    attachProductButtons
  };

  // On DOM ready attach automatically
  document.addEventListener('DOMContentLoaded', () => {
    attachProductButtons(document);
    document.querySelectorAll('.mini-cart').forEach(renderMiniCart);
  });

})();
