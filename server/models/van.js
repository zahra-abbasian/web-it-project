// model for the vans collection defined here
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const vanSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please include a Van name"],
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  ready: {
    type: Boolean,
    default: false,
  },
  // geo-location for the van
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

// method for generating a hash; used for password hashing
vanSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
vanSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// compile the Schema into a Model
const Van = mongoose.model("vans", vanSchema);

module.exports = Van;
