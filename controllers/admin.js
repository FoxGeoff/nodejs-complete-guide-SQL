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
  const product = new Product(                                                                                                                                                                                                                                                                                                                         
    (id = null),
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  console.log(product.title);
  Product
    .create({
      title: product.title,
      imageUrl: product.imageUrl,
      description: product.description,
      price: product.price,
    })
    .then((result) => {
      console.log(result);
      console.log("Created a new Product");
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
  Product.findById(prodId, (product) => {
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
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  /* TODO: best practice here would bw a callback */
  res.redirect("/admin/products");
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = new Product(
    (id = req.body.productId),
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );

  console.log(JSON.stringify(updatedProduct));

  updatedProduct.save();
  /* TODO: best practice here would bw a callback */
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    /* using templating engine */
    res.render("admin/products", {
      prods: products,
      pageTitle: "Product Administration",
      path: "/admin/products",
    });
  });
};
