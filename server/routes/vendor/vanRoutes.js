const express = require("express");
const vanController = require("../../controllers/vanController");

const vanRouter = express.Router();

// update van status
vanRouter.patch("/status/:id", vanController.updateVanStatus);

// get all ready vans
vanRouter.get("/ready", vanController.getAllReadyVans);

// get all vans
vanRouter.get("/", vanController.getAllVans);

// get a certain van
vanRouter.get("/:id", vanController.getVanDetails);

vanRouter.get("/rating/:id", vanController.getVanRating);

module.exports = vanRouter;
