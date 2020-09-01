 const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows,fieldData]) => {
    /* using templating engine */
    res.render("shop/products", {
      prods: rows,
      pageTitle: "Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  /* debug async using cb */
  Product.findById(prodId, (product) => {
    console.log(`Returning Product: ${JSON.stringify(product)}`);
    /* using templating engine */
    res.render("shop/product-details", {
      product: product,
      pageTitle: "Product Details",
      path: `/products/${product.id}`,
    });
  });
};

/* Using Promises */
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      /* using templating engine */
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      /* using templating engine */
      res.render("shop/cart", {
        products: cartProducts,
        pageTitle: "Shopping Cart",
        path: "/cart",
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    /* using templating engine */
    res.render("shop/orders", {
      prods: products,
      pageTitle: "Your Orders",
      path: "/orders",
    });
  });
};

exports.getCheckout = (re, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
