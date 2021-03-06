# Project: Node.js Complete Guide -SQL Database backend

## Kanban Task #10: SQL Introduction

### Task: Basic SQL and Create Table

### Task: Connecting our App to the SQL Database

- Run: `npm i mysql2 --save`
  -online ref: <https://www.npmjs.com/package/mysql2>

```javascript
// Connecting to the sql database
// util/database.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "test-user",
  database: "node-complete",
  password: "123user!!!",
});

module.exports = pool.promise();
```

```javascript
const db = require("./util/database");
// Connecting to the sql database
// app.js file
/* test run db query */
db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(JSON.stringify(result[0]));
  })
  .catch((err) => {
    console.log(err);
  });
```

### Task: Fetching Products

- controllers/shop.js

```javascript
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
```

### Task: Inserting Data into the Database

- in model/product.js

```JavaScript
save() {
    return Db.execute(
      "INSERT INTO products(title, price, imageUrl, description)VALUES (?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }
```

- in controlles/admin.j

```JavaScript
exports.postAddProduct = (req, res, next) => {
  /* DANGER: this data is shared across ALL node users :( */
  const product = new Product(
    (id = null),
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
```

### Task: Fetching a Single Product with the "where" Condition

- model/product.js

```JavaScript
static findById(prodId) {
    return Db.execute('SELECT * FROM products WHERE products.id = ?', [prodId]);
  }
```

- controller/Shop.js

```JavaScript
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId).then( ([product])  => {
    console.log(`Returning Product: ${JSON.stringify(product)}`);
    /* using templating engine */
    res.render("shop/product-details", {
      product: product[0],
      pageTitle: "Product Details",
      path: `/products/${product.id}`,
    });
  })
    .catch((err) => console.log(err));
};
```

## Kanban Task #11: Understanding Sequelize

### Task: Introduction

- Sequelize is an ORM Library (Object Mapping Library)

-Run ```npm i sequelize --save```

### Task: Connecting to the Database

- 1) Drop the current database table - we will be using Sequelize
- 2) Set up the Db connection pool

```JavaScript
/* This depends on 'mysql' */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "test-user", "123user!!!", {
  dialect: "mysql",
  host: "localhost", // not required is default value
});

/* Database conection pool */
module.exports = sequelize;
```

- model/product.js

```JavaScript
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;
```

### Task: Defining a Model

### Task: Syncing JS Definitions to the Database

### Task: Inserting Data and Creating a Product

### Task: Retrieving Data & Finding Products

- For the Products Page

```Javascript
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
```

### Task: Getting a Single Product with the "where" Condition

```JavaScript
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  /* can return more than one product */
  Product.findAll({ where: { id: prodId } })
    .then(([product]) => {
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
```

- To return just one product(two methods)

```Javascript
Product.findById(prodId).then(...).catch(...);
```

-OR

```JavaScript
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findOne({ where: { id: prodId } })
    .then((product) => {
      console.log(`Returning Product: ${JSON.stringify(product)}`);
  ```

### Task: Fetching Admin Products

### Task: Updating Products

- controller/admin/getEditProduct.js

- online reference: <https://sequelize.org/master/manual/model-querying-finders.html>. **findById() is replaced by findByPk()**

- GET

```JavaScript
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // string 'true'

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
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
```

- POST

```JavaScript
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  Product.findByPk(prodId)
    .then((product) => {
      product.id = prodId;
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      product.price = updatedPrice;

      console.log(JSON.stringify(product));
      /* use return fire promise */
      return product.save();
    })
    /* use then to wait for promise to finish */
    .then( result => {
      console.log('Updated Product');
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
```

- NOTE: the use of ```return product.save();```

and the use of ```.then( result => {...```

ensures that the save completes before the ```.then(res.redirect("/admin/products");)```

### Task: Deleting Products

- controllers/admin.js

```JavaScript
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
```

### Task: Creating a User Model

### Task: Adding a One-To-Many Relationship

- app.js

```Javascript
/* Sequelize Relations */
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
/* Optional Relation */
// User.HasMany(Product); //this function is no longer used

sequelize
  .sync() // For non-productution: .sync({ force: true })
  .then((result) => {
    // console.log(result);
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
```

### Task: Creating & Managing a Dummy User

```JavaScript
//* ONLY register NOT run middle ware */
app.use((req, res, next) => {
  User.findByPk(1)
  .then( (user) => {
    req.user = user;
    .next();
  }).catch(err => console.log(err));
});
```

### Task: Using Magic Association Methods

- Sequelize method: ```req.user.createProduct();```

- Manual Method: userId is a Sequelize Obj

```JavaScript
  Product.create({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    UserId: req.user.id // only in Db. sequelize obj
  })
  ```

- Sequelize Magic association Method:

  ```JavaScript
  req.user.createProduct({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
  })
  ```

### Task: Fetching Related Products

- Get user products

```javascript
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // string 'true'

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } }) //sequelizer
    // Product.findByPk(prodId)
    .then((product) => {
      const product = products[0] //new because we have an array of one
```

- NOTE we need both association for .getProducts()

```javascript
/* Sequelize Relations */
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
/* required Relation for req.user.getProducts() to work */
User.hasMany(Product);
```

- Replace ```Product.findAll()``` with ```req.user.getProducts()```

```javascript
exports.getProducts = (req, res, next) => {
  req.user.getProducts()
 .then((products) => {
    /* Sequelize Using Promises */
    res.render("admin/products", {
      prods: products,
      pageTitle: "Product Administration",
      path: "/admin/products",
    });
  });
};
```

### Task: One-To-Many &amp; Many-To-Many Relations

- model/cart.js

```javascript
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;
```

-model/cart-item.js

```javascript
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  qty: Sequelize.INTEGER
});

module.exports = CartItem;
```

- app.js Add associations

```javascript
...
/* ***Sequelize Relations*** */

/* One to many */
Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
/* required Relation for req.user.getProducts() to work */
User.hasMany(Product);

/* One to one */
User.hasOne(Cart);
Cart.belongsTo(User);

/* Many to many */
Cart.belongsToMany(Product, { through: CartItem} );
Product.belongsToMany(Cart, { through: CartItem} );
...
```

### Task: Creating & Fetching a Cart

- hint use console.log(result) to debug

```javascript
exports.getCart = (req, res, next) => {
req.user.getCart().then().catch();
```

- We also need to create a cart for the user at startup

```javascript
//app.js
...
.then((user) => {
    if (!user) {
      return User.create({ name: 'Geoff', email: 'test@test.com' });
    }
    return Promise.resolve(user); // return user will default to a promise too
  })
  .then((user) => {
    /* debug code */
    console.log(`User : ${JSON.stringify(user)}`);
    return user.createCart(); // <==
})
  .then((cart) =>{
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
```

- controller/admin.js

```javascript
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
```
