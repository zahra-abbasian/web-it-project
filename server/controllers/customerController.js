//const { default: CustomerDetails } = require("../../client/src/components/Customer/CustomerDetails/CustomerDetails");
const Customer = require("../models/customer");

// Get  one customer info
const getCustomerInfo = async (req, res, next) => {
  try {
    const customerInfo = await Customer.findOne({
      _id: req.params.id,
    }).lean();

    if (!customerInfo) {
      next({ name: "CastError" });
      return;
    }
    res.status(200).json({
      success: true,
      data: customerInfo,
    });
  } catch (err) {
    next(err);
  }
};

const hashNewPassword = async (password, id) => {
  const user = await Customer.findById(id);
  console.log(user);
  const hashed = user.generateHash(password);
  return hashed;
};

// Update customer info
const updateCustomerInfo = async (req, res, next) => {
  try {
    const { name, nameFamily, password } = req.body;
    const hashedPassword = await hashNewPassword(password, req.params.id);
    const customerDetails = await Customer.updateOne(
      { _id: req.params.id },
      { $set: { name, nameFamily, password: hashedPassword } },
      { runValidators: true }
    );
    const newCustomerDetails = await Customer.findById(req.params.id);
    console.log(newCustomerDetails);
    if (!newCustomerDetails) {
      next({ name: "CastError" });
      return;
    }
    // Log back the result with the current updated van
    res.status(200).json({
      success: customerDetails.nModified ? true : false,
      data: newCustomerDetails,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCustomerInfo,
  updateCustomerInfo,
};
