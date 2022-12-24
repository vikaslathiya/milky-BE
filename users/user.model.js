// The user model uses Mongoose to define the schema for the users collection saved in MongoDB.
// The exported Mongoose model object gives full access to perform CRUD (create, read, update, delete)
// operations on users in MongoDB,

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hash: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.set("toJSON", {
  virtuals: true, // virtuals: true includes the Mongoose virtual id property which is a copy of the MongoDB _id property.
  versionKey: false, // versionKey: false excludes the Mongoose version key (__v)
  // transform: function (doc, ret) { ... } removes the MongoDB _id property and password hash so they are not included in API responses.
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model("Users", userSchema);
