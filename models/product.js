const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        /* Note using => scopes 'this' to class */
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  /*  1- Delete product by productId
      2- Remove from Cart
      3- Adjust cart priceTotal 
  */
  static deleteById(prodId) {
    getProductsFromFile((products) => {
      const prodToDelete = products.find((p) => p.id === prodId);
      const updatedProducts = products.filter((prod) => prod.id !== prodId);
      if (!prodToDelete) {
        console.log(`product to delete, not found, ID: ${prodId}`);
      }
      /* debug */
      console.log(`product to delete: ${JSON.stringify(prodToDelete)}`);

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
        if (!err) {
          Cart.deleteProduct(prodId, prodToDelete.price);
        } 
      });
    });
  }

  /* requires cb (callback function)  instead of return*/
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      /* const product = product.find((id) => { p.id === id }); */
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
