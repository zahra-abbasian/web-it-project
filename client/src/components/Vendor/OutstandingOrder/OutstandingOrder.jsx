import React, { useEffect, useContext } from "react";
import { useQuery } from "react-query";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavBar from "../CommonModule/NavBar/NavBar";
import OrderCard from "./OrderCard/OrderCard";
import { getAllOutstandingOrders } from "../../../actions/index";
import { Link } from "react-router-dom";
import { socketIO } from "../../../actions/socket";
import "./OutstandingOrder.css";
import { UserContext } from "../../../actions/UserContext";
import CustomerInfo from "../CommonModule/CustomerInfo";

const OutstandingOrders = (props) => {
  const { id } = props.match.params;
  const user = useContext(UserContext);
  const vendorId = user?._id;

  // Get all outstanding orders froma given vendor
  const getOrdersQuery = useQuery("outstandingorders", () =>
    getAllOutstandingOrders(id)
  );
  const { data: orders, isLoading, refetch } = getOrdersQuery;

  useEffect(() => {
    if (vendorId) {
      // start listening for changes
      socketIO.emit("join", vendorId);
    }
    // when a new order is made, make the request again to get updated orders
    socketIO.on("new-order", () => {
      refetch();
    });

    return () => {
      socketIO.off("new-order");
    };
  }, [refetch, vendorId]);

  // sort orders in order from dateStarted descending
  const sortOrders = () => {
    if (orders) {
      var sortedOrders = orders.sort((a, b) => {
        return (
          new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
        );
      });
      return sortedOrders;
    }
  };

  return (
    <div>
      <NavBar />
      {/* list title and labels */}
      <div className="outstanding-order-list-container">
        <div className="list-title">
          <div className="title-text">Outstanding Orders</div>

          <Link to={`/vendor/orders/fulfilled/${id}`}>
            <button className="view-completed">View Completed</button>
          </Link>
        </div>
        <div className="header">
          <div className="item-row">
            <div className="right-filler">
              <div></div>
            </div>
            <div className="left-column">
              <h3 className="ready-label">Ready</h3>
            </div>
          </div>
        </div>

        {isLoading && <CircularProgress className="spinner" />}
        {orders ? (
          <ul className="orders-list">
            {/* for each order, render an associated order card */}
            {sortOrders().map((order) => (
              <div key={order._id}>
                <OrderCard
                  order={order._id}
                  vendorId={id}
                  customerName={<CustomerInfo customerId={order.customerId} />}
                  date={order.dateStart}
                  status={order.status}
                />
              </div>
            ))}
          </ul>
        ) : (
          !isLoading && <h2>Found no orders</h2>
        )}
      </div>
    </div>
  );
};

export default OutstandingOrders;
