// all order routes will go here
const express = require("express");
const orderController = require("../../controllers/orderController.js");

const orderRouter = express.Router();

// send back the info of all outstanding orders
orderRouter.get("/outstanding/:id", orderController.getAllOutstandingOrders);

// send back the info of one outstanding orders
orderRouter.get(
  "/outstanding/:vendorId/:id",
  orderController.getOneOutstandingOrders
);

// updates an order to have status: fulfilled
orderRouter.patch("/updateFulfilled/:id", orderController.updateOrderFulfilled);

// updates an order to have status: ready
orderRouter.patch("/updateReady/:id", orderController.updateOrderReady)

// send back the info of all fulfilled orders
orderRouter.get("/fulfilled/:id", orderController.getAllFulfilledOrders);

module.exports = orderRouter;
