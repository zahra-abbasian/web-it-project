import React from "react";

import "./ConfirmModal.css";

const ConfirmModal = ({ onConfirmOrder, onConfirmModalChange }) => {
  const displayText =
    "You can only change or cancel your order within 10 minutes of placing it. After that you must pay for the original order.";
  const backButtonHandler = () => {
    onConfirmModalChange(false);
  };
  const continueButtonHandler = () => {
    onConfirmOrder();
    onConfirmModalChange(false);
  };
  return (
    <>
      <div className="confirm-modal">
        <div className="modal-desc">{displayText}</div>
        <div className="modal-buttons">
          <button onClick={backButtonHandler}>Back</button>
          <button onClick={continueButtonHandler}>Continue</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
