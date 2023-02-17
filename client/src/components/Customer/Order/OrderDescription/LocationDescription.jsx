import React from "react";
import Marker from "../../../svg/Marker";
import "./OrderDescription.css";

const LocationDescription = ({ address }) => {
  return (
    <>
      <div className="order-title">
        <Marker className="marker" />
        <div className="location-text">Location</div>
      </div>
      <div className="location-desc">
        <div className="location-details">{address}</div>
      </div>
    </>
  );
};

export default LocationDescription;
