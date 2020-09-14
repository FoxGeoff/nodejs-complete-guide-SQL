const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");

const app = express();

const PageErrorController = require("./controllers/404");
const { ESTALE } = require("constants");

/*
//* test run db query 
db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(JSON.stringify(result[0]));
  })
  .catch((err) => {
    console.log(err);
  }); */

/* templating engine pug OR ejs */
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/* ONLY register NOT run middle ware */
app.use((req, res, next) => { 
  User.findByPk(1)
  .then( (user) => { 
    req.user = user; // this a Sequalizer object
    next();
  }).catch(err => console.log(err));
});

app.use("/admin", adminRoutes); // not calling as func adminRoutes()
app.use("/", shopRoutes);

// /* => any
app.use("/", PageErrorController.getPageNotFound);

const server = http.createServer(app);

/* Sequelize Relations */
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
/* Optional Relation */
// User.HasMany(Product); //this function is no longer used

// For non-productution: .sync({ force: true })
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Geoff", email: "test@test.com" });
    }
    return Promise.resolve(user); // return user will default to apromise too
  })
  .then((user) => {
    // console.log(user);
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
