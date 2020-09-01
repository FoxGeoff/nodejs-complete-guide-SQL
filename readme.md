# Project: Node.js Complete Guide -SQL Database backend

## Kanban Task #10: SQL Introduction

### Task: Basic SQL and Create Table

### Task: Connecting our App to the SQL Database

- Run: `npm i mysql2 --save`
-online ref: <https://www.npmjs.com/package/mysql2>

```javascript
// Connecting to the sql database
// util/database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'test-user',
    database: 'node-complete',
    password: '123user!!!'
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

## Kanban Task #11: SQL Introduction
