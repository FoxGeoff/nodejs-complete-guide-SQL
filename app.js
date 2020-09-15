const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");

const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

const PageErrorController = require("./controllers/404");
const { ESTALE } = require("constants");

/* templating engine pug OR ejs */
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/* ONLY register NOT run middle ware */
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      /* sequelize object */
      req.user = user;
      /* debug code */
      const msg = JSON.stringify(user);
      next(console.log(`User (middleware): ${msg}`));
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes); // not calling as func adminRoutes()
app.use("/", shopRoutes);

// /* => any
app.use("/", PageErrorController.getPageNotFound);

const server = http.createServer(app);

/* ***Sequelize Relations*** */

/* One to many */
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
/* required Relation for req.user.getProducts() to work */
User.hasMany(Product);

/* One to one */
User.hasOne(Cart);
Cart.belongsTo(User);

/* Many to many */
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// For non-productution use:  .sync({ force: true })
var isNewUser = false;
sequelize
  .sync({ force: false })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      isNewUser = true;
      return User.create({ name: "Geoff", email: "test@test.com" });
    }
    return Promise.resolve(user); // return user will default to a promise too
  })
  .then((user) => {
    /* debug code */
    console.log(`User : ${JSON.stringify(user)}`);
    if (isNewUser) {
      return user.createCart();
    }
  })
  .then((cart) => {
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
