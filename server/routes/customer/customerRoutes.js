// all customer routes will branch off here

const express = require("express");
const snackRouter = require("./snackRoutes");
const orderRouter = require("./orderRoutes");
const customerController = require("../../controllers/customerController.js");

const customerRouter = express.Router();

// handles all routes related to snacks
customerRouter.use("/snacks", snackRouter);

// handles all routes related to orders
customerRouter.use("/orders", orderRouter);

// send back the info of a customer
customerRouter.get("/:id", customerController.getCustomerInfo);

// update the info of a customer
customerRouter.put("/:id", customerController.updateCustomerInfo);

module.exports = customerRouter;
