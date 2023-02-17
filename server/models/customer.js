// model for the snack collection defined here
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
  nameFamily: {
    type: String,
  },
});

// method for generating a hash; used for password hashing
customerSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// compile the Schema into a Model
const Customer = mongoose.model("customers", customerSchema);

module.exports = Customer;
