const express = require("express");
const snackController = require("../../controllers/snackController");

const snackRouter = express.Router();

// gets all the snacks on the menu
snackRouter.get("/", snackController.getAllSnacks);

// gets the details of one snack on the menu
snackRouter.get("/:id", snackController.getSnackDetails);

module.exports = snackRouter;
