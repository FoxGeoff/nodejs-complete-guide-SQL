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

## Kanban Task #11: SQL Introduction
