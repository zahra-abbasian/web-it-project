import React from "react";
import Plus from "../../../svg/Plus";
import Minus from "../../../svg/Minus";
import { DISABLE_CANCEL_CHANGE_TIME } from "../../../../actions/utils";
import "./SnackCard.css";
const SnackCard = ({
  truck,
  img,
  name,
  price,
  setChosenSnacks,
  chosenSnacks = [],
  id,
  quantity = 0,
}) => {
  // increment the number of snacks for this snack item
  const incrementSnack = () => {
    if (!canChange()) {
      return;
    }
    const idx = chosenSnacks.findIndex((snack) => snack.id === id);
    let newArr = [...chosenSnacks];
    if (idx !== -1) {
      newArr[idx].quantity += 1;
    } else {
      // add this snack to the list
      newArr = [...newArr, { id, quantity: 1, name, price }];
    }
    setChosenSnacks(newArr);
  };
  // decrement the number of snacks for this snack item
  const decrementSnack = () => {
    if (!canChange()) {
      return;
    }
    const idx = chosenSnacks.findIndex((snack) => snack.id === id);
    if (idx === -1) return;
    let newArr = [...chosenSnacks];
    if (newArr[idx].quantity === 1) {
      newArr.splice(idx, 1);
    } else {
      newArr[idx].quantity -= 1;
    }
    setChosenSnacks(newArr);
  };

  const canChange = () => {
    const order = JSON.parse(window.localStorage.getItem("currentOrder"));
    const localTruck = JSON.parse(window.localStorage.getItem("truck"));
    if (localTruck?._id !== truck?._id) {
      return false;
    }
    if (order) {
      const startDate = Date.parse(order.dateStart);
      const endDate = Date.now();
      const seconds = (endDate - startDate) / 1000;
      return seconds < DISABLE_CANCEL_CHANGE_TIME;
    }
    return true;
  };
  return (
    <div className="card">
      {/* use image from api */}
      <div className="image-container" style={{ background: `url(${img})` }}>
        <div className="price-container">
          ${(Math.round(price * 100) / 100).toFixed(2)}
        </div>
      </div>
      <div className="interact-container">
        <div className="snack-name">{name}</div>
        <div className="amount-selectors">
          <Minus
            onClick={decrementSnack}
            className="amount-button"
            change={canChange()}
          />
          <div className="amount">{quantity}</div>
          <Plus
            onClick={incrementSnack}
            className="amount-button"
            change={canChange()}
          />
        </div>
      </div>
    </div>
  );
};

export default SnackCard;
