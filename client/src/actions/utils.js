// Shared code functionality
export const calculateTotalPrice = (snacks) => {
  if (!snacks) return 0;
  let price = 0;
  snacks.forEach((snack) => {
    price += snack.price * snack.quantity;
  });
  return price;
};

// choose view order message based on order status
export const orderStatusTranslate = (status) => {
  switch (status?.toLowerCase()) {
    case "outstanding":
      return "Preparing";
    case "fulfilled":
      return "Done";
    case "ready":
      return "Ready for pickup";
    case "cancelled":
      return "Cancelled";
    default:
      return "Done";
  }
};

export const discountPrice = (price) => {
  return price * 0.8;
};

export const checkSameSnacks = (snackList1, snackList2) => {
  // Check if the arrays are the same length
  if (snackList1.length !== snackList2.length) return false;

  // Check if all items exist and are in the same order
  for (let i = 0; i < snackList1.length; i++) {
    const snack1 = snackList1[i];
    const snack2 = snackList2[i];
    if (snack1.id !== snack2.snackId) return false;
    if (snack1.quantity !== snack2.quantity) return false;
  }
  return true;
}

// shared consts
export const DISABLE_CANCEL_CHANGE_TIME = 600;
export const MAX_TIME = 3600;
export const DISCOUNT_TIME = 900;
export const DISCOUNT_AMOUNT = 0.2;
