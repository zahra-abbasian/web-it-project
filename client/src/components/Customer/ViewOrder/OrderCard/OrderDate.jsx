import React from "react";
import "./OrderDate.css";

// date displayed on ordercards
const OrderDate = ({ date }) => {
  const newDate = new Date(date);
  const month = newDate.toLocaleString("default", { month: "long" });
  const day = newDate.toLocaleString("default", { day: "2-digit" });
  const year = newDate.getFullYear();

  return (
    <div className="order-date">
      <div className="order-date-month">{month}</div>
      <div className="order-date-year">{year}</div>
      <div className="order-date-day">{day}</div>
    </div>
  );
};

export default OrderDate;
