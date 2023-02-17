// all business logic pertaining to orders will go here
const Order = require("../models/order");
const Customer = require("../models/customer");
const Van = require("../models/van");
const Snack = require("../models/snack");
require("socket.io");

const snacksExist = async (snacks = []) => {
  for (let i = 0; i < snacks.length; i++) {
    const { snackId } = snacks[i];
    const snackExists = await Snack.exists({ _id: snackId });
    if (!snackExists) {
      return false;
    }
  }
  return true;
};

const createOrder = async (req, res, next) => {
  const { customerId, vendorId, snacks, totalPrice } = req.body;
  try {
    // ensure all of the Ids passed in exist
    const customerExists = await Customer.exists({ _id: customerId });
    const vanExists = await Van.exists({ _id: vendorId });
    const allSnacksExist = await snacksExist(snacks);
    if (!customerExists || !vanExists || !allSnacksExist) {
      next({ name: "CastError" });
      return;
    }

    // create new order object
    const newOrder = new Order({
      customerId,
      vendorId,
      snacks,
      totalPrice,
      active: 1
    });
    // adds new order to the collection
    await newOrder.save();
    // send new order through socket to vendor
    const io = req.app.get("io");
    io.sockets.to(vendorId.toString()).emit("new-order");
    res.status(201).json({
      success: true,
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    // look for all orders with status outstanding
    const order = await Order.findById(req.params.id);
    // if there are no orders, then respond with an error
    if (!order) {
      next({ name: "CastError" });
      return;
    } else {
      res.status(200).json({
        success: true,
        data: order,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAllOutstandingOrders = async (req, res, next) => {
  try {
    // look for all orders with status outstanding
    const outstandingOrders = await Order.find({
      vendorId: req.params.id,
      status: { $in: ["outstanding", "ready"] },
    }).lean();
    // if there are no orders, then respond with an error
    if (!outstandingOrders) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: true,
      data: outstandingOrders,
    });
  } catch (err) {
    next(err);
  }
};

// Get all fulfilled orders
const getAllFulfilledOrders = async (req, res, next) => {
  try {
    // look for all orders with status outstanding
    const fulfilledOrders = await Order.find({
      vendorId: req.params.id,
      status: "fulfilled",
    }).lean();
    // if there are no orders, then respond with an error
    if (!fulfilledOrders) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: true,
      data: fulfilledOrders,
    });
  } catch (err) {
    next(err);
  }
};

const getOneOutstandingOrders = async (req, res, next) => {
  try {
    // look for one order with status outstanding
    const outstandingOrder = await Order.findOne({
      vendorId: req.params.vendorId,
      _id: req.params.id,
    }).lean();

    // if there are no orders, then respond with an error
    if (!outstandingOrder) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: true,
      data: outstandingOrder,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderRating = async (req, res, next) => {
  try {
    // update order rating
    const orderRating = await Order.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    const updatedOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!updatedOrder) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: orderRating.nModified ? true : false,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderFulfilled = async (req, res, next) => {
  try {
    // update order to have status fulfilled
    const orderStatus = await Order.updateOne(
      { _id: req.params.id },
      {
        $currentDate: {
          dateFinished: true,
        },
        $set: {
          status: "fulfilled",
        },
      }
    );
    const updatedOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!updatedOrder) {
      next({ name: "CastError" });
      return;
    }
    const io = req.app.get("io");
    io.sockets
      .to(updatedOrder._id.toString())
      .emit("order-status-update", updatedOrder);
    res.status(200).json({
      success: orderStatus.nModified ? true : false,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderFinished = async (req, res, next) => {
  try {
    // update order to have status fulfilled
    const orderStatus = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "fulfilled",
          active: 0,
        },
      }
    );
    const updatedOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!updatedOrder) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: orderStatus.nModified ? true : false,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderCancelled = async (req, res, next) => {
  try {
    // update order to have status fulfilled
    const orderStatus = await Order.updateOne(
      { _id: req.params.id },
      {
        $currentDate: {
          dateFinished: true,
        },
        $set: {
          status: "cancelled",
          active: 0
        },
      }
    );
    const updatedOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!updatedOrder) {
      next({ name: "CastError" });
      return;
    }
    // update vendor the order got cancelled
    const io = req.app.get("io");
    io.sockets
      .to(updatedOrder.vendorId.toString() + "/" + updatedOrder._id.toString())
      .emit("cancelled-order");
    res.status(200).json({
      success: orderStatus.nModified ? true : false,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// Get all customer orders
const getAllCustomerOrders = async (req, res, next) => {
  try {
    // look for all orders with status outstanding
    const customerOrders = await Order.find({
      customerId: req.params.id,
    }).lean();
    // if there are no orders, then respond with an error
    if (customerOrders.length === 0) {
      next({ name: "CastError" });
      return;
    }
    // retrieve all the truckNames for the orders to send back to client
    const newOrders = await Promise.all(
      customerOrders.map(async (order) => {
        const vanInfo = await Van.findOne({
          _id: order.vendorId.toString(),
        }).lean();
        return { ...order, truckName: vanInfo.name };
      })
    );

    res.status(200).json({
      success: true,
      data: newOrders,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Apply discount to an order
const updateDiscountOrder = async (req, res, next) => {
  try {
    // update order to have status fulfilled
    const orderStatus = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          totalPrice: req.body.totalPrice,
          applyDiscount: true,
        },
      }
    );
    const updatedOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!updatedOrder) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: orderStatus.nModified ? true : false,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderReady = async (req, res, next) => {
  try {
    // update order to have status fulfilled
    const orderStatus = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "ready",
        },
      }
    );
    const updatedOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!updatedOrder) {
      next({ name: "CastError" });
      return;
    }
    const io = req.app.get("io");
    io.sockets
      .to(updatedOrder._id.toString())
      .emit("order-status-update", updatedOrder);
    res.status(200).json({
      success: orderStatus.nModified ? true : false,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

const getCustomerExistingOrder = async (req, res, next) => {
  try {
    // look for one order with status outstanding and customerId and vendorId matching params
    const outstandingOrder = await Order.findOne({
      customerId: req.params.customerId,
      active: 1
    }).lean();
    // if there is no order, then respond with an error
    if (!outstandingOrder) {
      next({ name: "CastError" });
      return;
    }
    const vanInfo = await Van.findOne({
      _id: outstandingOrder.vendorId.toString(),
    }).lean();
    res.status(200).json({
      success: true,
      data: { ...outstandingOrder, van: vanInfo }
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderSnacks = async (req, res, next) => {
  try {
    const { snacks, newPrice } = req.body;
    const allSnacksExist = await snacksExist(snacks);
    if (!allSnacksExist || newPrice < 0) {
      next({ name: "CastError" });
      return;
    }
    const updatedOrder = await Order.updateOne(
      { _id: req.params.id },
      {
        $currentDate: {
          dateStart: true,
        },
        $set: {
          snacks: snacks,
          totalPrice: newPrice,
        },
      }
    );
    const newOrder = await Order.findById(req.params.id);
    // if this order doesn't exist, send a 400 error
    if (!newOrder) {
      next({ name: "CastError" });
      return;
    }
    const io = req.app.get("io");
    io.sockets
      .to(newOrder.vendorId.toString() + "/" + newOrder._id.toString())
      .emit("updated-order");
    await newOrder.save();
    res.status(200).json({
      success: updatedOrder.nModified ? true : false,
      data: newOrder,
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = {
  getOrderDetails,
  getAllOutstandingOrders,
  updateOrderFulfilled,
  updateOrderRating,
  createOrder,
  updateOrderCancelled,
  updateDiscountOrder,
  updateOrderReady,
  getAllCustomerOrders,
  getOneOutstandingOrders,
  getAllFulfilledOrders,
  getCustomerExistingOrder,
  updateOrderSnacks,
  updateOrderFinished
};
