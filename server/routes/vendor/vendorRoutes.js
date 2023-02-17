// all vendor routes will go here
const express = require("express");

const orderRouter = require("./orderRoutes");
const vanRouter = require("./vanRoutes");

const vendorRouter = express.Router();

vendorRouter.get("/", (req, res) => {
  res.send("Vendor");
});

// handles all routes related to orders
vendorRouter.use("/orders", orderRouter);

// handles all routes related to vans
vendorRouter.use("/van", vanRouter);

module.exports = vendorRouter;
