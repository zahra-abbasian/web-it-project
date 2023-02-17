import React from "react";
import "./Capsule.css";
const Capsule = ({
  text,
  before = undefined,
  after = undefined,
  isCustomerPage = false,
}) => {
  // displays information on the navbar
  return (
    <div className="capsule">
      {!isCustomerPage && (
        <>
          {before && <div className="before">{before}</div>}
          <div className="text-wrapper">{text}</div>
          {after && <div className="after">{after}</div>}
        </>
      )}
    </div>
  );
};

export default Capsule;
