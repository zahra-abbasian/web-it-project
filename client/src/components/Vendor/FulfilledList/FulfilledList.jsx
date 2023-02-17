import React from "react";
import FulfilledOrderCard from "./FulfilledOrderCard";
import NavBar from "../CommonModule/NavBar/NavBar";
import "./fulfilledOrderCard.css";
import "../OutstandingOrder/OutstandingOrder.css";
import { Link } from "react-router-dom";
import CustomerInfo from "../CommonModule/CustomerInfo";
// For DB connection
import { useQuery } from "react-query";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAllFulfilledOrders } from "../../../actions";

const FulfilledList = (props) => {
  // Get the vendor ID
  const { id } = props.match.params;

  // Get orders info from DB
  const getFulfilledOrdersQuery = useQuery("fulfilledOrders", () =>
    getAllFulfilledOrders(id)
  );
  const { data: Orders, isLoading } = getFulfilledOrdersQuery;

  return (
    <div>
      <NavBar />
      <div className="outstanding-order-list-container">
        <div className="list-title">
          <div className="title-text">Picked-up Orders</div>
          <Link to={`/vendor/outstanding/${id}`}>
            <button className="view-completed">View Current</button>
          </Link>
        </div>
      </div>

      <div className="header">
        <div className="item-row">
          <div className="right-column">
            <div></div>
          </div>

          <div className="left-column">
            <h3 className="status-label">Status</h3>
          </div>
        </div>
      </div>

      {/* Check if it can get the orders info from DB */}
      {isLoading && <CircularProgress className="spinner" />}
      {Orders ? (
        <ul className="orders-list">
          {/* for each order the user has render an associated order card */}
          {Orders.map((Order) => (
            <div key={Order._id}>
              <FulfilledOrderCard
                key={Order._id}
                orderId={Order._id}
                status={Order.status}
                rating={Order.rating}
                customerName={<CustomerInfo customerId={Order.customerId} />}
                date={Order.dateFinished}
                applyDiscount={Order.applyDiscount}
              />
            </div>
          ))}
        </ul>
      ) : (
        // If the info can't be loaded, then display a message
        !isLoading && <h2 className="no-orders">Found no orders</h2>
      )}
    </div>
  );
};

export default FulfilledList;
