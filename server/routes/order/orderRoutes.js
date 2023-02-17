const express = require("express");
const orderController = require("../../controllers/orderController");

const orderRouter = express.Router();

// gets all the snacks on the menu
orderRouter.get("/:id", orderController.getOrderDetails);

// give rating to order
orderRouter.patch("/updateRating/:id", orderController.updateOrderRating);

module.exports = orderRouter;
