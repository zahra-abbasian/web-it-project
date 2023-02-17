const express = require("express");
const orderController = require("../../controllers/orderController");

const orderRouter = express.Router();

// creates a new order
orderRouter.post("/", orderController.createOrder);

// get all orders for a customer
orderRouter.get("/:id", orderController.getAllCustomerOrders);

// get an order for a specific customer
orderRouter.get("/customer/:customerId", orderController.getCustomerExistingOrder);

// cancel an order
orderRouter.patch("/cancel/:id", orderController.updateOrderCancelled);

// set an order to be finished
orderRouter.patch("/finished/:id", orderController.updateOrderFinished);

// apply discount to an order
orderRouter.patch("/discount/:id", orderController.updateDiscountOrder);

// change an order
orderRouter.patch("/change/:id", orderController.updateOrderSnacks);

module.exports = orderRouter;
