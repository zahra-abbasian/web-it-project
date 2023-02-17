import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { applyOrderDiscount } from "../../../../actions";
import {
  calculateTotalPrice,
  DISABLE_CANCEL_CHANGE_TIME,
  DISCOUNT_AMOUNT,
  DISCOUNT_TIME,
  MAX_TIME,
} from "../../../../actions/utils";
import Clock from "../../../svg/Clock";
import "./OrderDescription.css";

const TimeDescription = ({
  order,
  onCanEdit,
  onApplyDiscount,
  snacks,
  stop,
}) => {
  const [startTime, setStartTime] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(false);
  const [appliedCancelChanges, setAppliedCancelChanges] = useState(false);
  const [time, setTime] = useState(0);

  // Update order in backend about a discount being applied, as well as the new price
  const mutation = useMutation(async (orderId) => {
    const newTotalPrice =
      Math.round(
        (calculateTotalPrice(snacks) * (1 - DISCOUNT_AMOUNT) + Number.EPSILON) *
          100
      ) / 100;
    await applyOrderDiscount(orderId, newTotalPrice);
  });

  useEffect(() => {
    // Start a timer
    const interval = setInterval(() => {
      if (startTime) {
        let startDate = Date.parse(order.dateStart);
        let endDate = Date.now();
        const seconds = (endDate - startDate) / 1000;
        setTime(seconds);
      }
    }, 1000);

    // Signal from the order page to stop the timer eg. order status changed
    if (stop) {
      clearInterval(interval);
    }

    // If theres a valid order start the timer
    if (order) {
      setStartTime(true);
    }

    // After 10 minutes, disable canceling or changing order
    if ((order && stop) || time > DISABLE_CANCEL_CHANGE_TIME) {
      if (!appliedCancelChanges) {
        onCanEdit(false);
        setAppliedCancelChanges(true);
      }
    }

    // After 15 minutes, apply discount and new price
    if (time > DISCOUNT_TIME) {
      if (!appliedDiscount) {
        setAppliedDiscount(true);
        if (snacks.length >= 0) {
          onApplyDiscount(DISCOUNT_AMOUNT);
          mutation.mutate(order._id);
        }
      }
    }
    return () => clearInterval(interval);
  }, [
    order,
    onApplyDiscount,
    onCanEdit,
    time,
    appliedCancelChanges,
    appliedDiscount,
    mutation,
    snacks,
    startTime,
    stop,
  ]);

  return (
    <>
      {/* order status is outstanding */}
      {startTime ? (
        <div className="order-title">
          <div className="time-title-area">
            <Clock className="marker" />
            <div className="location-text">Time Elapsed</div>
          </div>
          <div className="time-remaining">
            {time > MAX_TIME ? <div>1 Hour +</div> : <CountDown time={time} />}
          </div>
        </div>
      ) : (
        <div className="order-title">
          <div className="time-title-area">
            {/* no order has been placed yet */}
            <Clock className="marker" />
            <div className="location-text">Estimated Time</div>
          </div>
          <div className="time-remaining">8 min</div>
        </div>
      )}
    </>
  );
};

// component to show the time shown on elapsed time
const CountDown = ({ time }) => {
  return (
    <>
      {time >= 0 ? (
        <div>
          <span>{("0" + Math.floor((time / 60) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor(time % 60)).slice(-2)}</span>
        </div>
      ) : (
        <div>
          <div>Loading</div>
        </div>
      )}
    </>
  );
};

export default TimeDescription;
