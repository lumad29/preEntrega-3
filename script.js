// let products = [
//   {
//     id: 1,
//     name: "Lawn Mower",
//     stock: 2,
//     price: 250,
//     imgPath: "lawnMower.jpg",
//   },
//   {
//     id: 2,
//     name: "Garden Tool Set",
//     stock: 7,
//     price: 25,
//     imgPath: "gardenToolSet.jpg",
//   },
//   {
//     id: 3,
//     name: "Ladder",
//     stock: 4,
//     price: 40,
//     imgPath: "ladder.jpg",
//   },
//   {
//     id: 4,
//     name: "Seeds",
//     stock: 1,
//     price: 10,
//     imgPath: "seeds.jpg",
//   },
//   {
//     id: 5,
//     name: "Plants",
//     stock: 3,
//     price: 12,
//     imgPath: "plants.jpg",
//   },
//   {
//     id: 6,
//     name: "Shovel",
//     stock: 8,
//     price: 25,
//     imgPath: "shovel.jpg",
//   },
//   {
//     id: 7,
//     name: "Plant pot",
//     stock: 8,
//     price: 15,
//     imgPath: "plantPot.jpg",
//   },
//   {
//     id: 8,
//     name: "Gloves",
//     stock: 8,
//     price: 10,
//     imgPath: "gloves.jpg",
//   },
// ];

fetch("./info.json")
  .then((response) => response.json())
  .then((products) => {
    let cart = [];
    let recoveredCart = localStorage.getItem("cart");
    if (recoveredCart) {
      cart = JSON.parse(recoveredCart);
    }
    showProducts(products, cart);

    showCart(cart);

    showProducts(products, cart);

    let btnShowHide = document.getElementById("showHide");
    btnShowHide.addEventListener("click", showHideCart);

    let finder = document.getElementById("finder"); // input

    let btnFind = document.getElementById("search");
    btnFind.addEventListener("click", () => showAndFinish(products, cart));

    function showAndFinish(products, cart) {
      let filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(finder.value)
      );
      showProducts(filteredProducts, cart);
    }

    function showProducts(products, cart) {
      let container = document.getElementById("containerProducts");
      container.innerHTML = "";

      products.forEach((product) => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
    <div id="center">
  <p>${product.name}</p>
  <img src=./images/${product.imgPath} />
  <p>$${product.price}</p>
  <button class="btn btn-outline-success btn-light" id=${product.id}>Add to cart</button>
  </div>`;

        container.appendChild(card);
        let addToCartBtn = document.getElementById(product.id);
        addToCartBtn.addEventListener("click", (e) =>
          addProductToCart(products, cart, e)
        );
      });
    }
    function addProductToCart(products, cart, e) {
      Toastify({
        text: "added to cart",
        duration: 3000,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      let productFound = products.find(
        (product) => product.id === Number(e.target.id)
      );

      let productInCart = cart.find(
        (product) => product.id === productFound.id
      );

      if (productFound.stock > 0) {
        if (productInCart) {
          productInCart.units++;
          productInCart.subtotal =
            productInCart.units * productInCart.unitPrice;
        } else {
          cart.push({
            id: productFound.id,
            name: productFound.name,
            unitPrice: productFound.price,
            units: 1,
            subtotal: productFound.price,
          });
        }
        productFound.stock--;
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        alert("No more stock");
      }
      showCart(cart);
    }

    function showCart(productsInCart) {
      if (productsInCart.length > 0) {
        let divCart = document.getElementById("cart");
        divCart.innerHTML = "";
        productsInCart.forEach((product) => {
          let tarjProdCart = document.createElement("div");
          tarjProdCart.className = "tarjProdCart";
          tarjProdCart.innerHTML = `
    <p>${product.name}</p>
    <p>$${product.unitPrice}</p>
    <p>${product.units}</p>
    <p>$${product.subtotal}</p> 
        `;
          divCart.appendChild(tarjProdCart);
        });
        let btn = document.createElement("button");
        btn.classList.add("btn-finish");
        btn.innerHTML = "Finish shopping";

        btn.addEventListener("click", finishShopping);
        divCart.appendChild(btn);
      }
    }

    function finishShopping() {
      Swal.fire({
        icon: "success",
        title: "Thank you for shopping",
      });
      let cart = document.getElementById("cart");
      cart.innerHTML = "";
      localStorage.removeItem("cart");
    }

    function showHideCart() {
      let cart = document.getElementById("cart");
      let containerProducts = document.getElementById("containerProducts");
      cart.classList.toggle("hide");
      containerProducts.classList.toggle("hide");
    }
  });
