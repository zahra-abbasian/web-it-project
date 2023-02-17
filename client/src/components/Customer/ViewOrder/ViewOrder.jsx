import React, { useContext } from "react";
import { useQuery } from "react-query";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavBar from "../NavBar/NavBar";
import Utensils from "../../svg/Utensils";
import OrderCard from "./OrderCard/OrderCard";
import { getAllCustomerOrders } from "../../../actions";
import { UserContext } from "../../../actions/UserContext";

import "./ViewOrder.css";
import { useHistory } from "react-router";

const ViewOrder = (props) => {
  // page for showing past orders from a user
  const user = useContext(UserContext);
  const { id } = props.match.params;

  // fetch all of the customer's orders
  const getOrdersQuery = useQuery("customerorders", () =>
    getAllCustomerOrders(id)
  );
  const { data: orders, isLoading } = getOrdersQuery;
  const history = useHistory();
  const truck = JSON.parse(window.localStorage.getItem("truck"));
  return (
    <>
      <div>
        <NavBar
          capsuleColour="grey"
          text={truck?.name}
          before={<Utensils />}
          after={<div>0.5km</div>}
        />
        <div className="order-list-container">
          {/* back button */}
          <div className="back-container">
            <button className="back-button" onClick={() => history.goBack()}>
              &lt; back
            </button>
          </div>
          {/* if there is a user currently logged in */}
          {user ? (
            <div>
              {isLoading && <CircularProgress className="spinner" />}
              {/* if there are orders to display */}
              {orders ? (
                <ul className="orders-list">
                  {/* for each order the user has render an associated order card */}
                  {orders
                    .map((order) => (
                      <OrderCard
                        key={order._id}
                        title={order.truckName}
                        price={order.totalPrice}
                        date={order.dateStart}
                        status={order.status}
                      />
                    ))
                    .reverse()}
                </ul>
              ) : (
                !isLoading && (
                  <h2 className="orders-list-no-order">Found no orders</h2>
                )
              )}
            </div>
          ) : (
            <h2>Please Log In</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewOrder;
