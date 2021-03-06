const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      /* Sequelize Using Promises */
      res.render("shop/products", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findOne({ where: { id: prodId } })
    .then((product) => {
      console.log(`Returning Product: ${JSON.stringify(product)}`);
      /* Sequelize using templating engine */
      res.render("shop/product-details", {
        product: product,
        pageTitle: "Product Details",
        path: `/products/${product.id}`,
      });
    })
    .catch((err) => console.log(err));
};

/* Sequelize Using Promises */
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      /* using templating engine */
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    console.log(cart);
    return cart
      .getProducts()
      .then((products) => {
        //* using templating engine
        res.render("shop/cart", {
          products: products,
          pageTitle: "Shopping Cart",
          path: "/cart",
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
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
