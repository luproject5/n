/* get cart total from session on load */
updateCartTotal();

/* button event listeners */
document.getElementById("emptycart").addEventListener("click", emptyCart);
var btns = document.getElementsByClassName("addtocart");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    addToCart(this);
  });
}

/* ADD TO CART functions */
function addToCart(elem) {
  //init
  var sibs = [];
  var getprice;
  var getproductName;
  var cart = [];
  var stringCart;
  //cycles siblings for product info near the add button
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType === 3) continue; // text node
    if (elem.className == "price") {
      getprice = elem.innerText;
    }
    if (elem.className == "productname") {
      getproductName = elem.innerText;
    }
    sibs.push(elem);
  }
  //create product object
  var product = {
    productname: getproductName,
    price: getprice,
  };
  //convert product data to JSON for storage
  var stringProduct = JSON.stringify(product);
  /*send product data to session storage */

  if (!sessionStorage.getItem("cart")) {
    //append product JSON object to cart array
    cart.push(stringProduct);
    //cart to JSON
    stringCart = JSON.stringify(cart);
    //create session storage cart item
    sessionStorage.setItem("cart", stringCart);
    addedToCart(getproductName);
    updateCartTotal();
  } else {
    //get existing cart data from storage and convert back into array
    cart = JSON.parse(sessionStorage.getItem("cart"));
    //append new product JSON object
    cart.push(stringProduct);
    //cart back to JSON
    stringCart = JSON.stringify(cart);
    //overwrite cart data in sessionstorage
    sessionStorage.setItem("cart", stringCart);
    addedToCart(getproductName);
    updateCartTotal();
  }
}

/* Calculate Cart Total */
function updateCartTotal() {
  //init
  var total = 0;
  var price = 0;
  var items = 0;
  var productname = "";
  var carttable = "";
  if (sessionStorage.getItem("cart")) {
    //get cart data & parse to array
    var cart = JSON.parse(sessionStorage.getItem("cart"));
    //get no of items in cart
    items = cart.length;
    //loop over cart array
    for (var i = 0; i < items; i++) {
      //convert each JSON product in array back into object
      var x = JSON.parse(cart[i]);
      //get property value of price
      price = parseFloat(x.price.split("$")[1]);
      productname = x.productname;
      //add price to total
      carttable +=
        "<tr><td>" +
        productname +
        "</td><td>$" +
        price.toFixed(2) +
        "</td><td><button class='remove' onclick='removeFromCart(" +
        i +
        ")'>Remove</button></td></tr>";
      total += price;
    }
  }
  //update total on website HTML
  document.getElementById("total").innerHTML = total.toFixed(2);
  //insert saved products to cart table
  document.getElementById("carttable").innerHTML = carttable;
  //update items in cart on website HTML
  document.getElementById("itemsquantity").innerHTML = items;
}

//user feedback on successful add
function addedToCart(pname) {
  var message = pname + " was added to the cart";
  var alerts = document.getElementById("alerts");
  alerts.innerHTML = message;
  if (!alerts.classList.contains("message")) {
    alerts.classList.add("message");
  }
}

/* User Manually empty cart */
function emptyCart() {
  //remove cart session storage object & refresh cart totals
  if (sessionStorage.getItem("cart")) {
    sessionStorage.removeItem("cart");
    updateCartTotal();
    //clear message and remove class style
    var alerts = document.getElementById("alerts");
    alerts.innerHTML = "";
    if (alerts.classList.contains("message")) {
      alerts.classList.remove("message");
    }
  }
}

/* Remove a product from the cart */
function removeFromCart(index) {
  // Get the current cart from sessionStorage
  var cart = JSON.parse(sessionStorage.getItem("cart"));

  // Remove the product at the given index
  cart.splice(index, 1);

  // Save the updated cart back to sessionStorage
  sessionStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart display and total
  updateCartTotal();
}

/* Button event listener for checkout */
document.getElementById("checkout").addEventListener("click", function () {
  checkout();
});

// Checkout function
function checkout() {
  var cartMessage = "Your Order Details:\n";
  var cart = JSON.parse(sessionStorage.getItem("cart"));
  var total = 0;

  if (cart && cart.length > 0) {
    var productCounts = {};

    // Count the quantity of each product
    cart.forEach(function (item) {
      var product = JSON.parse(item);
      if (productCounts[product.productname]) {
        productCounts[product.productname]++;
      } else {
        productCounts[product.productname] = 1;
      }
    });

    // Format the cart items into the message
    for (var productName in productCounts) {
      var quantity = productCounts[productName];
      var price = getProductPrice(productName); // Assume you have a function to get the price of each product
      var itemTotal = price * quantity;
      total += itemTotal;

      cartMessage += `${productName} x${quantity} - $${itemTotal.toFixed(2)}\n`;
    }

    // Add total to the message
    cartMessage += `\nTotal: $${total.toFixed(2)}`;

    // Send the message via WhatsApp
    var whatsappURL = `https://wa.me/96181791764?text=${encodeURIComponent(
      cartMessage
    )}`;
    window.open(whatsappURL, "_blank");

    // Optionally, empty the cart after checkout
    sessionStorage.removeItem("cart");
    updateCartTotal(); // Update the cart display
  } else {
    alert("Your cart is empty!");
  }
}

// Function to get the price of a product (you can update this based on your actual product prices)
function getProductPrice(productName) {
  const productPrices = {
    "Evergreen Shampoo": 6.99,
    "Shine Shampoo": 6.99,
    "Radiance Shampoo": 6.99,
    "Hydrating Hair Serum": 9.99,
    "Soie Hair Mask": 11.99,
    "Organic Hair Spray": 4.99,
    "Rozi Scalp Massager": 2.99,
  };

  return productPrices[productName] || 0;
}
