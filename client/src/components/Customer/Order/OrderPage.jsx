import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router";
import { useMutation } from "react-query";
import NavBar from "../NavBar/NavBar";
import Utensils from "../../svg/Utensils";
import OrderDetails from "./OrderDetails/OrderDetails";
import ConfirmModal from "./ConfirmModal/ConfirmModal";
import LocationDescription from "./OrderDescription/LocationDescription";
import TimeDescription from "./OrderDescription/TimeDescription";
import RatingForm from "./Rating/RatingForm";
import { socketIO } from "../../../actions/socket";
import {
  createOrder,
  cancelOrder,
  updateOrdersFinished,
} from "../../../actions/index";
import {
  calculateTotalPrice,
  orderStatusTranslate,
  DISABLE_CANCEL_CHANGE_TIME,
} from "../../../actions/utils";
import { UserContext } from "../../../actions/UserContext";
import { round2 } from "../../../utils";
import "./OrderPage.css";

const OrderPage = (props) => {
  const user = useContext(UserContext);
  const customerId = user?._id;
  const { id } = props.match.params;
  const location = useLocation();
  const history = useHistory();

  const [truck, setTruck] = useState();
  // Finished is a state to indicate when the user has gone through the entire order
  const [finished, setFinished] = useState(false);
  // discount is to indicate the discount amount being applied to the orders eg. 20%
  const [discount, setDiscount] = useState(0);
  // canEdit is a state to indicate if user can cancel or change their order
  const [canEdit, setCanEdit] = useState(true);
  // redirect is a state for when there is an error and we will render something else
  const [redirect, setRedirect] = useState(false);
  // confirmModalOpen is a state just before the user confirms an order to show a pop up
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState();
  // check locally if there is an active order in place
  const [order, setOrder] = useState(
    location?.state?.currentOrder ||
      JSON.parse(window.localStorage.getItem("currentOrder")) ||
      null
  );

  // get the currently selected truck for the order
  const localTruck = JSON.parse(window.localStorage.getItem("truck"));
  if (!localTruck) {
    history.push("/trucks");
    document.location.reload();
  }
  // get the currently selected snacks for the order
  const snacks =
    location?.state?.snacks ||
    JSON.parse(window.localStorage.getItem("chosenSnacks")) ||
    [];

  const mutation = useMutation(async () => {
    // If the user is not logged in, they cannot place order
    if (!customerId) {
      history.push("/login");
    }
    // place order
    try {
      const res = await createOrder(
        customerId,
        localTruck._id,
        snacks,
        calculateTotalPrice(snacks)
      );
      setOrder(res);
      // send socket update to vendor an order has been created
      socketIO.emit("order-created", localTruck._id);
    } catch (err) {
      setRedirect(true);
    }
  });
  // check if we can disable the buttons
  const disableButtonCheck = () => {
    // state set to false
    if (!canEdit) {
      return true;
    }
    // past the time where you can change or cancel
    if (order && order.status === "outstanding") {
      let startDate = Date.parse(order.dateStart);
      let endDate = Date.now();
      const seconds = (endDate - startDate) / 1000;
      if (seconds > DISABLE_CANCEL_CHANGE_TIME) {
        return true;
      }
    }
    // order is ready or fulfilled
    if (order && (order.status === "ready" || order.status === "fulfilled")) {
      return true;
    }
    return false;
  };

  // cancel the current order
  const cancelCurrentOrder = async () => {
    // Reset local storage
    window.localStorage.setItem("currentOrder", null);
    window.localStorage.setItem("chosenSnacks", JSON.stringify([]));
    try {
      await cancelOrder(order._id);
    } catch (err) {
      console.log(err);
    }
    history.push("/menu");
  };

  useEffect(() => {
    const sendFinishedRequest = async (orderId) => {
      await updateOrdersFinished(orderId);
    };
    // Check if user entered an invalid order/:id in the url
    if (id && order?._id !== id) {
      setRedirect(true);
    }
    // If user created a new order
    if (order) {
      setTruck(order?.van);
      // connect to socket so vendor can update this order live
      socketIO.emit("join", order._id);
      // first order being created
      if (order.status === "outstanding") {
        window.localStorage.setItem("currentOrder", JSON.stringify(order));
        history.push(`/order/${order._id}`);
      }
      // order is completed
      if (order.status === "fulfilled") {
        sendFinishedRequest(order._id);
        setFinished(true);
      }
      // show the status to the customer depending on order status
      setOrderStatus(orderStatusTranslate(order.status));
    }

    // update from vendor to change the state either from
    // outstanding --> ready OR
    // ready --> fulfilled
    socketIO.on("order-status-update", (newOrder) => {
      setCanEdit(false);
      setOrder(newOrder);
    });

    return () => {
      socketIO.off("order-status-update");
    };
  }, [order, id, history]);

  return (
    <>
      {/* order is done */}
      {finished && (
        <RatingForm orderId={order._id} onFinishedChange={setFinished} />
      )}
      {/* just before user confirms their order, alert them about 10 minute rule */}
      {confirmModalOpen && (
        <ConfirmModal
          onConfirmOrder={mutation.mutate}
          onConfirmModalChange={setConfirmModalOpen}
        />
      )}
      {/* pop up appearing, make the background faint */}
      <div className={confirmModalOpen || finished ? "order-details-mask" : ""}>
        <NavBar
          capsuleColour="#ccc"
          text={truck ? truck.name : localTruck.name}
          before={<Utensils />}
          after={truck ? `` : `${round2(localTruck.distanceFromUser)} km`}
        />
        <div className="order-page-container">
          {mutation.isError || redirect ? (
            <div className="error-details">
              Cannot create order, please refresh the page and try again
            </div>
          ) : (
            <div>
              {/* main part of the page */}
              <LocationDescription
                address={truck ? truck.address : localTruck.address}
              />
              <TimeDescription
                order={order}
                onCanEdit={setCanEdit}
                onApplyDiscount={setDiscount}
                snacks={snacks}
                stop={order?.status !== "outstanding"}
              />
              <div className="note">
                <div className="note-header">Note: </div>
                <div>
                  Orders not completed within 15 minutes receive a 20% discount
                </div>
              </div>
              <OrderDetails
                snacks={snacks}
                status={orderStatus}
                applyDiscount={discount}
              />
              {/* if there is an order, show a cancel and change button */}
              {order ? (
                <div className="pill-button-container">
                  <button
                    className="pill-button-two"
                    style={{
                      left: "0",
                      backgroundColor: disableButtonCheck()
                        ? "grey"
                        : "#ffb701",
                      color: disableButtonCheck() ? "white" : "black",
                    }}
                    onClick={() => {
                      cancelCurrentOrder();
                    }}
                    disabled={disableButtonCheck()}>
                    Cancel
                  </button>
                  <button
                    className="pill-button-two"
                    style={{
                      right: "0",
                      backgroundColor: disableButtonCheck()
                        ? "grey"
                        : "#ffb701",
                      color: disableButtonCheck() ? "white" : "black",
                    }}
                    onClick={() => {
                      history.push("/menu");
                    }}
                    disabled={disableButtonCheck()}>
                    Change
                  </button>
                </div>
              ) : (
                <div className="pill-button-container">
                  {/* else if there is no order, show back and confirm button */}
                  <button
                    className="pill-button-two"
                    style={{
                      left: "0",
                      background: "black",
                      color: "white",
                    }}
                    onClick={() => {
                      history.push("/menu");
                    }}>
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (snacks.length !== 0) {
                        setConfirmModalOpen(true);
                      }
                    }}
                    className="pill-button-two"
                    style={{ right: 0 }}>
                    confirm
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderPage;
