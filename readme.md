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
