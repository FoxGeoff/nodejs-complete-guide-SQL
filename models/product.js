const Cart = require('./cart');
const Db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
  }

  /*  1- Delete product by productId
      2- Remove from Cart
      3- Adjust cart priceTotal 
  */
  static deleteById(prodId) {
   
  }

  /* return a promise */ 
  static fetchAll() {
    return Db.execute('SELECT * FROM products');
  }

  static findById(prodId) {
  
  }
};
