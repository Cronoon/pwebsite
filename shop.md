---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Oil Paintings and Art Prints
permalink: /shop/
published: false
---
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=GBP"></script>
<h2>Buy Your Items</h2>

  <!-- List of items with checkboxes -->
  <div id="item-list">
    <label><input type="checkbox" data-id="item1" data-name="Item 1" data-price="10.00"> Item 1 ($10)</label><br>
    <label><input type="checkbox" data-id="item2" data-name="Item 2" data-price="15.00"> Item 2 ($15)</label><br>
    <label><input type="checkbox" data-id="item3" data-name="Item 3" data-price="12.50"> Item 3 ($12.50)</label><br>
    <!-- Add up to 10 items -->
  </div>

  <!-- PayPal Button -->
  <div id="paypal-button-container">vvv</div>

  <script>
    paypal.Buttons({
      createOrder: function(data, actions) {
        // Gather selected items
        const selectedItems = Array.from(document.querySelectorAll('#item-list input:checked')).map(item => ({
          name: item.dataset.name,
          unit_amount: { currency_code: "USD", value: item.dataset.price },
          quantity: "1",
          sku: item.dataset.id // Unique reference for each item
        }));

        if(selectedItems.length === 0) {
          alert("Please select at least one item.");
          return;
        }

        return actions.order.create({
          purchase_units: [{
            items: selectedItems,
            amount: {
              currency_code: "USD",
              value: selectedItems.reduce((total, item) => total + parseFloat(item.unit_amount.value), 0).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: selectedItems.reduce((total, item) => total + parseFloat(item.unit_amount.value), 0).toFixed(2)
                }
              }
            }
          }]
        });
      },

      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Transaction completed by ' + details.payer.name.given_name);
          console.log('Transaction details:', details);
        });
      }

    }).render('#paypal-button-container');
  </script>