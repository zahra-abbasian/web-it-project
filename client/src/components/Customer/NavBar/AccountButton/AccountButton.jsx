import React from "react";
import classnames from "classnames";
import "./AccountButton.css";

const AccountButton = ({ className, text }) => {
  return (
    <button className={classnames("account-button", className)}>{text}</button>
  );
};

export default AccountButton;
