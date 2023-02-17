import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useMediaQuery } from "react-responsive";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import NavBar from "../NavBar/NavBar";
import Utensils from "../../svg/Utensils";
import ShoppingCart from "../../svg/ShoppingCart";
import SnackCard from "./SnackCard/SnackCard";
import { getAllSnacks, changeOrderSnacks } from "../../../actions/";
import {
  calculateTotalPrice,
  checkSameSnacks,
  DISABLE_CANCEL_CHANGE_TIME,
} from "../../../actions/utils";
import "./Menu.css";
import { round2 } from "../../../utils";

const Menu = () => {
  const [loading, setLoading] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  // grab snacks from localstorage if available
  const [chosenSnacks, setChosenSnacks] = useState(
    JSON.parse(window.localStorage.getItem("chosenSnacks")) || []
  );
  const history = useHistory();

  // get the order from localstorage
  const order = JSON.parse(window.localStorage.getItem("currentOrder"));
  // get the truck from localstorage
  const truck =
    useLocation()?.state || JSON.parse(window.localStorage.getItem("truck"));
  window.localStorage.setItem("truck", JSON.stringify(truck));

  useEffect(() => {
    // if the truck isn't available, the user hasn't selected it yet, redirect to trucks page
    if (!truck) {
      history.push("/trucks");
      document.location.reload();
    }
  }, [truck, history]);

  // Everytime user adds to snack collection, update localstorage
  useEffect(() => {
    window.localStorage.setItem("chosenSnacks", JSON.stringify(chosenSnacks));
  }, [chosenSnacks]);

  // if there is no active order currently, can switch to any truck
  useEffect(() => {
    if (!order) {
      window.localStorage.setItem("truck", JSON.stringify(truck));
    }
  }, [truck, order]);

  // get snacks from db
  const snacksQuery = useQuery("snacks", getAllSnacks);
  const { data: snacks, isLoading, error } = snacksQuery;

  // utility function to calculate number of snacks
  const numberOfSnacks = () => {
    let total = 0;
    chosenSnacks.forEach((snack) => {
      total += snack.quantity;
    });
    return total;
  };

  // utility function to check if we are allowed to change our current order
  const canChange = (orderedSnacks) => {
    // active order and there are snacks in cart
    if (order && orderedSnacks.length > 0) {
      let startDate = Date.parse(order.dateStart);
      let endDate = Date.now();
      const time = (endDate - startDate) / 1000;
      // can still change before the time to disable cancellation/changing orders
      return time < DISABLE_CANCEL_CHANGE_TIME;
    }
    return false;
  };

  // sends request to db that the order has been changed
  const updateOrder = useMutation(async () => {
    if (canChange(chosenSnacks)) {
      try {
        // checks if there are any differences in the snacks in current order
        // and the currently selected snacks we want to change
        if (checkSameSnacks(chosenSnacks, order?.snacks)) {
          // snacks are the same, order does not need to change
          return history.push("/order");
        }
        const newPrice = calculateTotalPrice(chosenSnacks);
        // loading to notify customer later the request is being sent
        setLoading(true);
        const newOrder = await changeOrderSnacks(
          order?._id,
          chosenSnacks,
          newPrice
        );
        window.localStorage.setItem("currentOrder", JSON.stringify(newOrder));
        setLoading(false);
        history.push("/order");
      } catch (err) {
        console.log(err);
      }
    } else {
      // cannot change the snacks, go to current order instead
      history.push("/order");
    }
  });

  // render this if the menu is sending the changed snacks to the db
  if (loading) {
    return (
      <div>
        <NavBar
          capsuleColour="grey"
          text={truck?.name}
          before={<Utensils />}
          after={<div>{round2(truck?.distanceFromUser)} km</div>}
        />
        <CircularProgress className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <NavBar
        capsuleColour="grey"
        text={truck?.name}
        before={<Utensils />}
        after={<div>{round2(truck?.distanceFromUser)} km</div>}
      />
      <div className="menu-container">
        <Grid container spacing={4} className="grid">
          {/* error handling and loading of snack cards */}
          {error && <div>Error loading snacks</div>}
          {isLoading && <CircularProgress className="spinner" />}
          {/* map each snack to a corresponding snack card */}
          {snacks &&
            snacks.map((snack) => (
              <Grid
                container
                key={snack._id}
                item
                xs={12}
                md={6}
                lg={4}
                alignItems="center"
                justify="center"
                style={{ display: "flex" }}>
                <SnackCard
                  truck={truck}
                  img={snack.image}
                  name={snack.name}
                  price={snack.price}
                  id={snack._id}
                  chosenSnacks={chosenSnacks}
                  setChosenSnacks={setChosenSnacks}
                  quantity={
                    chosenSnacks.find((chosen) => chosen.id === snack._id)
                      ?.quantity
                  }
                />
              </Grid>
            ))}
        </Grid>
        {/* conditionally render the shopping cart based on screen size */}
        <div
          className={`cart-button-${isDesktopOrLaptop ? "desktop" : "mobile"}`}>
          {chosenSnacks.length > 0 ? (
            <div>
              {isDesktopOrLaptop ? (
                <>
                  <div className="cart-num-desktop">{numberOfSnacks()}</div>
                  <button
                    onClick={() => {
                      updateOrder.mutate();
                    }}
                    disabled={chosenSnacks.length === 0}>
                    <ShoppingCart
                      className="cart"
                      width={80}
                      height={80}
                      fill={chosenSnacks.length === 0 ? "#aaa" : undefined}
                    />
                  </button>
                </>
              ) : (
                <>
                  <div className="cart-num-mobile">{numberOfSnacks()}</div>
                  <button
                    onClick={() => {
                      updateOrder.mutate();
                    }}
                    disabled={chosenSnacks.length === 0}>
                    <ShoppingCart
                      className="cart"
                      fill={chosenSnacks.length === 0 ? "#aaa" : undefined}
                    />
                  </button>
                </>
              )}
            </div>
          ) : isDesktopOrLaptop ? (
            <div>
              <div className="cart-num-desktop">{numberOfSnacks()}</div>
              <button
                onClick={() => {
                  updateOrder.mutate();
                }}
                disabled={chosenSnacks.length === 0}>
                <ShoppingCart
                  className="cart"
                  width={80}
                  height={80}
                  fill={chosenSnacks.length === 0 ? "#aaa" : undefined}
                />
              </button>
            </div>
          ) : (
            <>
              <div className="cart-num-mobile">{numberOfSnacks()}</div>
              <button
                disabled={chosenSnacks.length === 0}
                onClick={() => {
                  updateOrder.mutate();
                }}>
                <ShoppingCart
                  className="cart"
                  fill={chosenSnacks.length === 0 ? "#aaa" : undefined}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
