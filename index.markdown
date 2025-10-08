---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Oil Paintings and Art Prints
permalink: /
---
<section class="product-list">
  {% for product in site.data.products %}
    {% include product_card.html product=product %}
  {% endfor %}
</section>

<script src="{{ '/assets/js/cart.js' | relative_url }}"></script>bbb