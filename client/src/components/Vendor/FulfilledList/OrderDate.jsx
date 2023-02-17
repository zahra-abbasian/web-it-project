import React from "react";
import "./OrderDate.css";

// The date card that displays the date for an order
const OrderDate = ({ date }) => {
  const newDate = new Date(date);
  const month = newDate.toLocaleString("default", { month: "long" });
  const day = newDate.toLocaleString("default", { day: "2-digit" });
  const year = newDate.getFullYear();
  const hour = newDate.getHours();
  const minute = newDate.getMinutes();

  return (
    <>
      {" "}
      {hour}:{minute > 9 ? minute : `0${minute}`} - {day} {month} {year}{" "}
    </>
  );
};

export default OrderDate;
