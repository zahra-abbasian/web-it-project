import React, { useEffect, useState } from "react";
import TruckIcon from "../../../svg/TruckIcon";
import Utensils from "../../../svg/Utensils";
import { round2 } from "../../../../utils";
import "./NearbyList.css";
import { useHistory } from "react-router";
import { getVanRating } from "../../../../actions";

const NearbyList = ({ truckList }) => {
  const history = useHistory();

  const [vanRatings, setVanRatings] = useState([]);

  useEffect(() => {
    const getVanRatings = async () => {
      if (truckList.length === 0) return;
      const ratings = await Promise.all(
        truckList.map(async (truck) => {
          return await getVanRating(truck._id);
        })
      );
      setVanRatings(ratings);
    };
    getVanRatings();
  }, [truckList]);
  return (
    <div className="list-container">
      {/* add a van capsule for each van with some information */}
      {truckList.map((truck, index) => (
        <div
          className="van-capsule"
          key={`${truck.name}__${index}`}
          onClick={() => {
            // user can click on the capsule to redirect to the menu
            history.push({ pathname: "/menu", state: truck });
          }}
        >
          <TruckIcon className="truck-icon" />
          <div className="truck-details-container">
            <div>{truck.name}</div>
            <div className="bottom-truck-container">
              <div>{round2(truck.distanceFromUser)} km</div>
              <div className="truck-stars">
                ★ {vanRatings[index] ? vanRatings[index] : "N/A"}
              </div>
            </div>
          </div>
          <div className="utensils-container orange-bg">
            <Utensils className="utensils-icon" size={30} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyList;
