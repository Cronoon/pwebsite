---
layout: default
title: My Store
---

<h1>{{ page.title }}</h1>

<!-- PayPal Cart / Checkout Button -->
<div class="checkout-button-container">
  <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
    <input type="hidden" name="cmd" value="_cart">
    <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL">
    <input type="hidden" name="display" value="1">
    <input type="submit" value="View Cart / Checkout" class="paypal-checkout-button">
  </form>
</div>

<!-- Store Grid -->
<div class="store-grid">

  <!-- Product 1 -->
  <div class="product-card">
    <img src="/assets/images/product1.jpg" alt="Product 1">
    <h2>Sample Product 1</h2>
    <p>Price: $19.99</p>
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_cart">
        <input type="hidden" name="add" value="1">
        <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL">
        <input type="hidden" name="item_name" value="Sample Product 1">
        <input type="hidden" name="amount" value="19.99">
        <input type="hidden" name="currency_code" value="USD">
        <input type="submit" value="Add to Cart" class="paypal-button">
    </form>
  </div>

  <!-- Product 2 -->
  <div class="product-card">
    <img src="/assets/images/product2.jpg" alt="Pro
