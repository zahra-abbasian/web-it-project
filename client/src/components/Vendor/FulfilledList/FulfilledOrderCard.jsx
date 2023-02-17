import React from "react";
import "./fulfilledOrderCard.css";
import OrderDate from "./OrderDate";

// The basic order card that each order from db is mapped to
const FulfilledOrderCard = ({
  orderId,
  status,
  customerName,
  date,
  applyDiscount,
  rating,
}) => {
  return (
    <div className="container">
      <div className="item-row">
        <div className="right-column">
          <h2>#{orderId} </h2>
        </div>
        {/* Check for discounted orders to show status as late */}
        <div className="left-column">
          {applyDiscount ? (
            <h2 className="status-info">late</h2>
          ) : (
            <h2 className="status-info">{status}</h2>
          )}
        </div>
      </div>
      <div className="item-row">
        <div className="right-column">
          <h2>{customerName}</h2>
        </div>
        <div className="order-rating">{rating && `${rating.value} ★`}</div>
      </div>
      {/* get the date of order */}
      <p>
        Completed <OrderDate date={date} />{" "}
      </p>
    </div>
  );
};

export default FulfilledOrderCard;
