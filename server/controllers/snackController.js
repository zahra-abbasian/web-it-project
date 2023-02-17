const Snack = require("../models/snack");

// sends a response with every snack on the menu
const getAllSnacks = async (_, res, next) => {
  try {
    // get all snacks from the collection
    const snacks = await Snack.find();
    res.status(200).json({
      success: true,
      data: snacks,
    });
  } catch (err) {
    next(err);
  }
};

// sends a response with the details of the snack with the given id
const getSnackDetails = async (req, res, next) => {
  try {
    const snackDetails = await Snack.findById(req.params.id);
    // if snack doesn't exist, send 400 error
    if (!snackDetails) {
      next({ name: "CastError" });
      return;
    } else {
      res.status(200).json({
        success: true,
        data: snackDetails,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSnacks,
  getSnackDetails,
};
