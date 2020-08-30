# Project: Node.js Complete Guide

## Kanban Task #3: Understanding the Basics

### Task: Creating a Node Server

```JavaScript
/* app.js  */
const server = http.createServer((req, res) => {
  console.log(req);
  // process.exit(); This will quit the 'Event Loop'
});

server.listen(3000);
```

### Task: The node Lifecycle & Event Loop

- This is kept running as long as there is a listener (req) registered.
- This is the Event Loop. Js is single threaded and executes on events.

### Task: Understanding Requests

- `console.log(req.url, req.method, req.headers);`

```javaScript
PS C:\Users\foxge\Github\nodejs-complete-guide> node app.js
/ GET {
  host: 'localhost:3000',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.5',
  'accept-encoding': 'gzip, deflate',
  dnt: '1',
  connection: 'keep-alive',
  'upgrade-insecure-requests': '1'
}
```

### Task: Sending Responses

```JavaScript
const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My first psge</title></head>');
  res.write('<body><h1>Hello world, from node server!</h1></body>');
  res.write('</html>');
  res.end();
});
```

### Task: Routing Requests

```JavaScript
const server = http.createServer((req, res) => {
  /* Routing Requests */
  const url = req.url;
  if(url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  /* Note: After res.end() we must not call 'setHeader" or 'res.write()' */
  ...
});

server.listen(3000);
```

### Task: Redirecting Requests

```JavaScript
const fs = equire("fs");
...
const method=fs.method;
...
if (url === "/message" && method === "POST") {
     fs.writeFileSync('message.txt', 'DUMMY');
     res.statusCode=302;
     res.setHeader('Location', '/');
     return res.end();
  }
```

### Task: Parsing Request Bodies

```JavaScript
const body = [];
...
if (url === "/message" && method === "POST") {
    /* Stream 'data' and read Buffer */
    req.on("data", (chunk) => {
      console.log(`Stream: ${chunk}`);
      body.push(chunk);
    });
    /* To work on each chunk we buffer them */
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(`text: ${parsedBody}`);
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message);
    });

    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
```

- Output:

```JavaScript
Stream: message=Hello+from+Geoff
text: message=Hello+from+Geoff
```

### Task: Understanding Event Driven Code Execution

- these are call back functions. and will run 'sometime'
- the code is not blocked. So order of execution is:

```JavaScript
const server = http.createServer((req, res) => {

req.on("data", (chunk) => { }); //1st async callback
req.on("end", () => { }); //2nd async callback
...
res.statusCode = 302; // 1st sync before !st async and 2nd async
res.setHeader("Location", "/");
return res.end();
...
 return fs.writeFileSync("message.txt", message);
 //'return' forces callback before next sync code
  res.setHeader("Content-Type", "text/html"); // sync code
  ....
});

server.listen(3000); //1st sync exe (no return as end of callback)
```

### Task: Blocking and Non-Blocking Code

- `fs.writeFileSync("message.txt", message);`
- 'writeFile' is non blocking main thread. Async Code (better)
- 'writeFileSync' is blocking main thread. Sync Code

```JavaScript
fs.writeFile("message.txt", message, (err) => {
  /* Run after writeFile completes*/
  res.statusCode = 302;
  res.setHeader("Location", "/");
  return res.end();
});
```

- ALL BUILT INTO NODE.JS
- Remember node uses one single JS thread
- Remember we always to dispatch onto the Event Loop: Event callbacks functions
- Remember The actual callback function is sent to a Worker Pool to wait execution
- Remember the Worker Pool is multi threaded
- Remember when the Callback function is done, it triggers a callback to the Event Loop
- Remember not to block main thread

### Task: Using the Node Modules System

- Import and export route.js file

```JavaScript
/* custom file */
const routes = require("./routes");

const server = http.createServer(routes);
```

- export file:

```JavaScript
module.exports = requestHandler;
```

- Alternative from:

```JavaScript
const server = http.createServer(routes.requestHandler);
```

- Alternative form:

```JavaScript
module.exports = {
    requestHandler: requestHandler,
    textMessage: "Just some text"
}

OR

export.requestHandler = requestHandler;
export.textMessage = "Just some text"
```

## Kanban Task #4: Improving Development Workflow and Debugging

- `Fixing Errors, Developing Efficiently

### Task:Understanding NPM Scripts

- To generate file 'package.jason' Run:

```JavaScript
> npm init
package name: (nodejs-complete-guide)
version: (1.0.0)
...
```

- Example npm script - "start: "node app.js"

### Task: Installing 3ed Party Packages

- `npm install nodemon --save-dev`

### Task: Using Nodemon for Autorestarts

-(no code submited)

### Task: Understanding different Error Types

- in VSCode start debugger (node)

-(no code submited)

### Task: Restarting the Debugger Automatically After Editing our App

- On menu: view/explorer, Run/Add Configuration... < node >
- this creates the file: {...}launch.json

```JavaScript
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\app.js",
            "restart": true,
            "runtimeExecutable": "nodemon",
            "console": "integratedTerminal"        }
    ]
}
```

- Note the global install must be used `npm install nodemon -g`

### Task: Changing Variables in the Debug Console

-Go to the left hand column while in debug and double click to change it's

-value, which will run in the app.

## Kanban Task #5: Working with Express.js

### Task: What is Express.js

-(no code added)

### Task: Installing Express.js

- Run: `npm i express --save`

### Task: Adding Middleware

- Example:

```JavaScript
const http = require("http");
const express = require("express");

const app = express();

app.use((req, res, next) => {
    console.log('In 1st middleware');
    next();
});

app.use((req, res, next) => {
    console.log('In 2nd middleware');
});

const server = http.createServer(app);

server.listen(3000);
```

```text
In 1st middleware
In 2nd middleware
```

### Task: How Middleware Works

- Each middleware must end with 'next();' or 'res.???'

```JavaScript
app.use((req, res, next) => {
    console.log('In 2nd middleware');
    res.send('<h1>Hello from Express</h1>');
});
```

### Task: Expres.js - Looking Behind the Scenes

-(no code comit)

### Task: Handling different routes

```JavaScript
app.use("/add-product", (req, res, next) => {
  res.send("Hello from Express product!");
});

app.use("/", (req, res, next) => {
  res.send("Hello from Express!");
});
```

### Task: Parsing Incoming Requests

- Run: `npm i body-parser --save`

- This is not yet limited to a POST request

```JavaScript
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/add-product", (req, res, next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>'
  );
});

app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});
```

### Task: Limiting Middleware Execution to POST

- `app.post("/product", (req, res, next) => {... etc`

- `app.get("/product", (req, res, next) => {... etc`

### Task: Using Express Router

- Note route order does count
- but the route is matched by Verb and Path

- App.js

```JavaScript
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes); // not calling as func adminRoutes()
app.use(shopRoutes);

const server = http.createServer(app);

server.listen(3000);
```

- routes/admin.js

```JavaScript
const express =  require('express');
const router = express.Router();

router.get("/add-product", (req, res, next) => {
    res.send(
      '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>'
    );
  });

  router.post("/product", (req, res, next) => {
    console.log(req.body);
    res.redirect("/");
  });

module.exports = router;
```

### Task: Adding 404 Error Page

- App.js

```Javascript
app.use((req, res,next) => {
    res.status(404).send('<h1>404 Error. Page not found!</h1>')
});
```

### Task: Filtering Paths

```Javascript
/* in app.js  */
app.use('/admin', adminRoutes);
...
/* in routes/admins.js */
// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
    res.send(
      '<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>'
    );
  });
```

### Task: Create HTML Pages

- app.js

```JavaScript
router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});
```

### Task: Returning 404 Page

- in app.js

```JavaScript
const path = require("path");
...
// /* => any
app.use("/", (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
```

### Task: Using a Helper Function for Navigation

- util/path,js

```JavaScript
const path = require("path");

module.exports = path.dirname(process.mainModule.filename);
```

- routes/admin.js

```JavaScript
const rootDir = require('../util/path');
...
// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "../", "views", "add-product.html"));
  res.redirect("/admin");
});
...
```

### Task: Styling our Pages

- WIP

### Task: Serving Files Statically

- public / \*

- Use in app.js: `app.use(express.static(path.join(__dirname, 'public')));`

- note path is (no 'public'): `<link rel="stylesheet" href="/css/main.css">`

## Kanban Task #6: Working with Dynamic Contenet & Adding Templating Engines

### Task: Sharing Data across Requests and Users

### Task: Installing & Implementing Pug

- Run: `npm i ejs pug express-handlebars --save`

### Task: Outputting Dynamic Content

### Task: Converting HTML Files to Pug

- Convert 404.htm to 404.pug

### Task: Adding a Layout

### Task: Finishing the Pug Template

- set active class on header

## Task: Template using EJS or Handlebars

## Task: Working on the Layout with Partials

- How to add folders to the views

```JavaScript
const products = Product.fetchAll((products) => {
    /* using templating engine */
    res.render("shop/shop", { // <= moved to 'views/shop/shop.est
      prods: products,
      pageTitle: "Shop",
      path: "/admin",
    });
  });
```

## Kanban Task #7: The Model View Controller (MVC)

### Task: Adding Controllers

### Task: Finishing the Controllers

## Task: Adding a Product Model

## Task: Storing Data in Files via the Model

- model/product.save() [to a file]

```JavaScript
    save() {
        const p = path.join(path.dirname(process.mainModle.filename),
        'data',
        'products.json'
        );
        fs.readFile(p, (err, fileContent) => {
            let products =[];
            if(!err) {
                products = JSON.parse(fileContent);
            }
            /* Note using => scopes 'this' to the class */
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }
```

- model/product.feachAll() [from a file]

### Task:  Fetching Data from Files via the Model

### Task: Retriving Data

- model/Product the code is async and therefore uses a call back function

### Task: Refactoring the File Storage Code

- mvc pattern done

## Kanban Task #8: Optional: Enhancing the App

### Task: Registering the Routes

### Task: Storing Product Data

### Task: Displaying Product Data

- For Flex Layout Referance:
- <https://css-tricks.com/snippets/css/a-guide-to-flexbox/>

### Task: Edit & Delete Products

### Task: Adding another Item

- Do these to prepare for Kanban Task #9

## Kanban Task #9: Dynamic Routes & Advanced Models

### Task: Adding the Product ID to the Path

### Task: Extracting Dynamic Params

### Task: Loading Product Detail Data

### Task: Rendering the Product Detail View

### Task: Passing Data with POST Requests

### Task: Adding a Cart Model

### Task: Using Query Params

### Task: Pre-Populating the Edit Product Page with Data

### Task: Linking to the Edit Page

### Task: Editing the Product Data

### Task: Adding the Product-Delete Functionality

### Task: Displaying Cart Items on the Cart Page

### Task: Deleting Cart Items <= HERE

### Kanban Task #10: SQL Introduction

### Task: Connecting our App to the SQL Database

- Run: `npm i mysql2 --save`
-online ref: <https://www.npmjs.com/package/mysql2>

### Task: Basic SQL and Create Table
