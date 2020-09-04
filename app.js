const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");

const app = express();

const PageErrorController = require("./controllers/404");

/* test run db query */
db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(JSON.stringify(result[0]));
  })
  .catch((err) => {
    console.log(err);
  });

/* templating engine pug OR ejs */
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes); // not calling as func adminRoutes()
app.use("/", shopRoutes);

// /* => any
app.use("/", PageErrorController.getPageNotFound);

const server = http.createServer(app);


sequelize.sync().then( result => { 
  console.log(result);
  server.listen(3000);
})
.catch(err =>{
  console.log(err);
});

