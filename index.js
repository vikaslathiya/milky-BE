// The index.js file is the entry point into the api, it configures application middleware,
// binds controllers to routes and starts the Express web server for the api.

// require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./_helpers/jwt");
const errorHandler = require("./_helpers/error-handler");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.get("/", (req, res) => {
  res.send("Welcome to milky app backend :)");
});

// api routes
app.use("/users", require("./users/users.controller"));

// global error handler
app.use(errorHandler);

// start server
const port = 8080;
app.listen(port, () => {
  console.log(`Milky app backend server listening at http://localhost:${port}`);
});
