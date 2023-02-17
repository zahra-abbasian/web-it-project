import React from "react";
import OrderDate from "./OrderDate";
import { orderStatusTranslate } from "../../../../actions/utils";
import "./OrderCard.css";

// represents each order that a customer has in the view orders screen
const OrderCard = ({ date, title, price, status }) => {
  const newStatus = orderStatusTranslate(status);

  return (
    <li>
      <div className="order-item">
        <OrderDate date={date} />
        <div className="order-item-description">
          <div className="order-item-row">
            <h2>{title}</h2>
            <div className="order-item-price">${price}</div>
          </div>
          <div className="order-item-status">{newStatus}</div>
        </div>
      </div>
    </li>
  );
};

export default OrderCard;
