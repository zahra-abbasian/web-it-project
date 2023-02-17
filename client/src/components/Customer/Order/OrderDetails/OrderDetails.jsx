import React from "react";
import { calculateTotalPrice } from "../../../../actions/utils";
import "./OrderDetails.css";

const SnackDetail = ({ quantity, name, price, discount }) => {
  // discount is the % being applied eg. 0.2 to represent 20%
  return (
    <div>
      <div className="item-list-section">
        <div className="item-amount">{quantity}x</div>
        <div className="item-name">{name}</div>
        <div className="item-price">
          ${(Math.round(price * quantity * 100) / 100).toFixed(2)}
        </div>
      </div>
      {/* show discounted orders if its time to display discount*/}
      {discount !== 0 && (
        <div className="item-list-section">
          <div className="item-amount">{quantity}x</div>
          <div className="item-name">Late Order Discount</div>
          <div className="item-price">
            -$
            {((Math.round(price * quantity * 100) / 100) * discount).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderDetails = ({ snacks, status, applyDiscount }) => {
  let totalPrice = calculateTotalPrice(snacks);
  if (applyDiscount) {
    totalPrice *= 1 - applyDiscount;
  }
  return (
    <div className="order-summary">
      <div className="summary-header">
        <div className="header-title">Order</div>
        {status && <div className="order-status">{status}</div>}
      </div>
      <div className="item-list">
        {/* list out each of the snacks with their quantities and prices */}
        {snacks &&
          snacks.map((snack) => (
            <SnackDetail
              key={snack.id}
              discount={applyDiscount}
              quantity={snack.quantity}
              name={snack.name}
              price={snack.price}
            />
          ))}
        <div className="total-price">
          <div className="total">Total:</div>
          {/* list the total order price */}
          <div className="price">${totalPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
