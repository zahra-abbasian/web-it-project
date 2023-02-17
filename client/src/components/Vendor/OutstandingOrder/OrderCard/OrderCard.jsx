import React, { useState } from "react";
import { useMutation } from "react-query";
import moment from "moment";
import { useHistory } from "react-router";
import { updateOrdersFulfilled } from "../../../../actions";
import CheckMark from "../../../svg/CheckMark";
import CheckMarkOutline from "../../../svg/CheckMarkOutline";
import "./OrderCard.css";

// Represents each order that a customer has in the view orders screen
const OrderCard = ({ order, vendorId, date, customerName, status }) => {
  const history = useHistory();
  const [isFulfilled, setFulfilled] = useState(false);

  // Go to the order details page
  const goToOrder = () => {
    history.push(`/vendor/outstanding/${vendorId}/${order}`);
  };

  // Sets the order's status as fulfilled
  const fulfillOrder = () => {
    mutation.mutate();
    setFulfilled(() => true);
  };
  const mutation = useMutation(async () => {
    await updateOrdersFulfilled(order);
  });

  return (
    <>
      {!isFulfilled && (
        <li>
          <div className="vendor-order-item">
            <div className="vendor-order-item-description">
              <div className="vendor-order-item-row">
                #{order}
                {customerName}
              </div>
              <div className="vendor-order-item-date">
                {moment(date).fromNow()}
              </div>
              {/* Renders different checkmarks based on order's status */}
              {status === "outstanding" ? (
                <CheckMarkOutline className="check-mark" />
              ) : (
                <CheckMark className="check-mark" />
              )}
              <button className="see-details" onClick={goToOrder}>
                Details
              </button>
              <button className="fulfill-order" onClick={fulfillOrder}>
                Picked Up
              </button>
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default OrderCard;
