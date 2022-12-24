//  The MongoDB wrapper connects to MongoDB using Mongoose and exports an object containing all of the
//  database model objects in the application (currently only User). It provides an easy way to access
//  any part of the database from a single point.

const config = require("../config.json");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(config.connectionString);

mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
};
