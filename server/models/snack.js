// model for the snack collection defined here
const mongoose = require("mongoose");

const snackSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

// compile the Schema into a Model
const Snack = mongoose.model("snacks", snackSchema);

module.exports = Snack;
