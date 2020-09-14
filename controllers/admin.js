const Product = require("../models/product");

// exports.postEdit

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  /* DANGER: this data is shared across ALL node users :( */

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  // sequelize Magic association Method:
  /*
  req.user.createProduct({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
  }) */

  //Manual Method: userId is a Sequelize Obj
  Product.create({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    UserId: req.user.id, // only in Db. sequelize obj
  })
    .then((result) => {
      console.log(result);
      console.log("Created a new Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // string 'true'

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        /* TODO: Add `Error: Product Id: ${prodId} not found` */
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("Delete product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  /* first promise */
  Product.findByPk(prodId)
    .then((product) => {
      product.id = prodId;
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      product.price = updatedPrice;

      console.log(JSON.stringify(product));
      /* use return fire #2 promise before .then()*/
      return product.save();
    })
    /* use then to wait for promise to finish */
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    /* Sequelize Using Promises */
    res.render("admin/products", {
      prods: products,
      pageTitle: "Product Administration",
      path: "/admin/products",
    });
  });
};
