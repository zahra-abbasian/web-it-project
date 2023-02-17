/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import NavBar from "../CommonModule/NavBar/NavBar";
import OneSnack from "./OneSnack";
import CustomerInfo from "../CommonModule/CustomerInfo";
import { socketIO } from "../../../actions/socket";
import "./OutstandingOrderDetails.css";
import { useHistory } from "react-router";
import { DISCOUNT_TIME } from "../../../actions/utils";
import {
  getOneOutstandingOrder,
  updateOrdersFulfilled,
  updateOrdersReady,
} from "../../../actions/index";

export const OutstandingOrderDetails = () => {
  const Ids = useParams();
  const history = useHistory();
  const [cancelled, setCancelled] = useState(false);
  const [pastTime, setPastTime] = useState(0);
  const [startTime, setStartTime] = useState(false);
  const [time, setTime] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [discount, setDiscount] = useState(false);
  const [buttonSelector, setButtonSelector] = useState("black-button");
  const [snacks, setSnacks] = useState([]);

  const orderMutation = useMutation(async () => {
    // get the current order for this page
    getOneOutstandingOrder(Ids.vendorId, Ids.id)
      .then((response) => {
        setOrderDetails(response);
        setSnacks(response.snacks);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  useEffect(() => {
    if (Ids) {
      orderMutation.mutate();
    }

    // start listening for updates on websocket
    if (Ids.vendorId && Ids.id) {
      socketIO.emit("join", `${Ids.vendorId}/${Ids.id}`);
    }

    // when the order is updated, reflect this in the UI
    socketIO.on("updated-order", () => {
      orderMutation.mutate();
    });

    socketIO.on("cancelled-order", () => {
      setCancelled(true);
    });

    return () => {
      // cleanup sockets
      socketIO.off("updated-order");
      socketIO.off("cancelled-order");
    };
  }, [Ids]);

  //calculate the time that has passed
  const hasPastTime = () => {
    let startDate = Date.parse(orderDetails.dateStart);
    let endDate = Date.now();
    const seconds = (endDate - startDate) / 1000;
    setPastTime(seconds);
  };

  //invoke timer
  useEffect(() => {
    // Start a timer
    const interval = setInterval(() => {
      if (startTime) {
        let startDate = Date.parse(orderDetails.dateStart);
        let endDate = Date.now();
        const seconds = (endDate - startDate) / 1000;
        setTime(DISCOUNT_TIME - seconds);
        if (!(orderDetails.length === 0)) {
          if (orderDetails.status === "outstanding") {
            if (DISCOUNT_TIME - seconds < 0) {
              //apply discount when time's up
              setDiscount(true);
              orderMutation.mutate();
              return clearInterval(interval);
            }
          }
        }
      }
    }, 1000);

    if (!discount) {
      // start timer if discount has not yet been applied
      setStartTime(true);
    } else {
      // discount has been applied, show negative time
      setStartTime(false);
      hasPastTime();
    }
    if (orderDetails.status === "ready") {
      setButtonSelector("trigger-button");
    }
    return () => clearInterval(interval);
  }, [orderDetails]);

  if (cancelled) {
    return (
      <div>
        <NavBar />
        {/* go back */}
        <button className="back" onClick={() => history.goBack()}>
          &lt; BACK
        </button>
        <div className="cancelled-order">Order has been cancelled</div>
      </div>
    );
  }

  return (
    <div>
      <div className="top-box">
        <NavBar />
      </div>

      {/* button to represent order as ready */}
      <div className="ready">
        <button
          className={buttonSelector}
          onClick={() => {
            updateOrdersReady(Ids.id);
            setButtonSelector("trigger-button");
            orderDetails.status = "ready";
          }}>
          READY
        </button>
      </div>

      <div className="picked-up">
        <button
          className="black-button"
          onClick={() => {
            updateOrdersFulfilled(Ids.id);
            history.goBack();
          }}>
          {" "}
          PICKED UP{" "}
        </button>
      </div>

      {/* go back */}
      <button className="back" onClick={() => history.goBack()}>
        &lt; BACK
      </button>

      {/* show customer */}
      <div className="customer-container">
        <h6> Order: {orderDetails._id} </h6>
        <CustomerInfo
          className="customer-container"
          customerId={orderDetails.customerId}></CustomerInfo>
        <div>
          {/* figure out how to display the time */}
          {Math.floor(pastTime / 3600 / 24) > 0 && (
            <div className="past-time">
              {" "}
              {Math.floor(pastTime / 3600 / 24)} Day{" "}
            </div>
          )}
          {Math.floor((pastTime / 3600) % 24) > 0 && (
            <div className="past-time">
              {Math.floor((pastTime / 3600) % 24)} Hour
            </div>
          )}
          {Math.floor((pastTime % 3600) / 60) > 0 && (
            <div className="past-time">
              {" "}
              {Math.floor((pastTime % 3600) / 60)} Minute
            </div>
          )}
          {Math.floor((pastTime % 3600) % 60) > 0 && (
            <div className="past-time">
              {" "}
              {Math.floor((pastTime % 3600) % 60)} Secs ago
            </div>
          )}
        </div>
      </div>

      <div className="outstanding-order-title">Ordered Snacks</div>

      {/* show items */}
      <div className="item-section">
        <div className="snacks-container">
          {snacks.map((snack) => (
            <div key={snack.snackId}>
              <OneSnack snackId={snack.snackId}></OneSnack>
              <div className="outstanding-order-item-amount">
                {snack.quantity}x
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*show price  */}
      <div className="price-position">
        <h2 style={{ fontSize: "2rem", fontWeight: "400" }}>Total</h2>
        {discount ? (
          <div className="outstanding-order-price">
            <div className="discount-apply">
              <div className="discount-sign"> -20% </div>$
              {orderDetails.totalPrice}
            </div>
          </div>
        ) : (
          <div className="outstanding-order-price">
            ${orderDetails.totalPrice}
          </div>
        )}
      </div>

      {/* show clock */}
      <div className="clock-container">
        <h2 style={{ top: "-2em", position: "absolute" }}>Time Remaining</h2>
        {discount ? (
          <div className="discount-apply">
            <div className="time">00:00</div>
          </div>
        ) : (
          <div className="time">
            {orderDetails.status === "ready" ? (
              <div>Ready</div>
            ) : (
              <div>
                <span>{("0" + Math.floor((time / 60) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor(time % 60)).slice(-2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutstandingOrderDetails;
