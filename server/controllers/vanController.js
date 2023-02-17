// all business logic pertaining to vans will go here
const {
  Types: { ObjectId },
} = require("mongoose");
const Order = require("../models/order");
const Van = require("../models/van");

const updateVanStatus = async (req, res, next) => {
  try {
    const vanStatus = await Van.updateOne(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true }
    );
    const newVan = await Van.findById(req.params.id);
    if (!newVan) {
      next({ name: "CastError" });
      return;
    }
    // Log back the result with the current updated van
    res.status(200).json({
      success: vanStatus.nModified ? true : false,
      data: newVan,
    });
  } catch (err) {
    next(err);
  }
};

const getAllVans = async (_, res, next) => {
  try {
    // get all vans from the vans collection
    const vans = await Van.find();
    res.status(200).json({
      success: true,
      data: vans,
    });
  } catch (err) {
    next(err);
  }
};

const getAllReadyVans = async (_, res, next) => {
  try {
    const vans = await Van.find({ ready: true }).lean();
    res.status(200).json({
      success: true,
      data: vans || [],
    });
  } catch (err) {
    next(err);
  }
};

const getVanDetails = async (req, res, next) => {
  try {
    const vanDetails = await Van.findById(req.params.id);
    // if van doesn't exist, send 400 error
    if (!vanDetails) {
      next({ name: "CastError" });
      return;
    } else {
      res.status(200).json({
        success: true,
        data: vanDetails,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getVanRating = async (req, res, next) => {
  try {
    const rating = await Order.aggregate([
      {
        $match: {
          status: "fulfilled",
          vendorId: new ObjectId(req.params.id),
          rating: {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: "vendorId",
          avgRating: {
            $avg: "$rating.value",
          },
        },
      },
    ]);
    if (rating.length === 0) {
      res.status(200).json({
        success: true,
        data: NaN,
      });
    } else {
      res.status(200).json({
        success: true,
        data: Math.round(rating[0].avgRating * 10) / 10,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateVanStatus,
  getAllVans,
  getVanDetails,
  getAllReadyVans,
  getVanRating,
};
