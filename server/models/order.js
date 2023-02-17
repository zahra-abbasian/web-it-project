// model for the snack collection defined here
const mongoose = require("mongoose");

const snackOrderSchema = new mongoose.Schema({
  snackId: { type: mongoose.Schema.Types.ObjectId, ref: "Snack" },

  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Van",
    required: true,
  },
  snacks: [snackOrderSchema],
  totalPrice: {
    type: Number,
    default: 0,
    required: true,
    min: 0,
  },
  applyDiscount: {
    type: Boolean,
    default: false,
    required: true,
  },
  dateStart: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateFinished: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["ready", "outstanding", "fulfilled", "cancelled"],
    default: "outstanding",
    required: true,
  },
  rating: {
    value: {
      type: Number,
      min: 0,
      max: 5,
    },
    comment: String
  },
  active: {
    type: Number,
    enum: [0, 1],
    default: 0,
    required: true
  }
});

// compile the Schema into a Model
const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
