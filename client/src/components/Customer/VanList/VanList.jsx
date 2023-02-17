import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import haversine from "haversine";
import NavBar from "../NavBar/NavBar";
import Van from "../../svg/Van";
import List from "../../svg/List";
import Compass from "../../svg/Compass";
import classnames from "classnames";
import NearbyList from "./NearbyList/NearbyList";
import VanMap from "./VanMap/VanMap";
import "./VanList.css";
import { getAllReadyVans } from "../../../actions";
import { useUserLocation } from "../../../hooks";

const VanList = () => {
  // get the user location
  const userLocation = useUserLocation();
  const [sortedTruckList, setSortedTruckList] = useState([]);
  const [listSelected, setListSelected] = useState(true);

  // get all ready vans
  const vansData = useQuery("ready-vans", getAllReadyVans);
  const { data: truckList } = vansData;

  useEffect(() => {
    if (!userLocation || !truckList) {
      return;
    }

    // calculate 5 nearest trucks using haversine formula
    let newTruckList = truckList.map((truck) => ({
      ...truck,
      distanceFromUser:
        haversine(
          truck.location.coordinates,
          [userLocation.coords.longitude, userLocation.coords.latitude],
          { format: "[lon,lat]", unit: "meter" }
        ) / 1000,
    }));
    const fiveNearestVans = newTruckList
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser)
      .slice(0, 5);
    setSortedTruckList(fiveNearestVans);
  }, [truckList, userLocation]);

  return (
    <div className="van-list-container">
      <NavBar
        capsuleColour="grey"
        text={"Trucks near you"}
        before={<Van />}
        after={<Van />}
      />
      <div className="list-container">
        {/* conditionally render either list or map */}
        {listSelected ? (
          <NearbyList truckList={sortedTruckList} />
        ) : (
          <VanMap truckList={sortedTruckList} userLocation={userLocation} />
        )}
      </div>
      <Footer listSelected={listSelected} setListSelected={setListSelected} />
    </div>
  );
};

const Footer = ({ listSelected, setListSelected }) => {
  return (
    <footer className="footer">
      {/* select which van list page to view (map / list) */}
      <div onClick={() => setListSelected(true)}>
        <List className={classnames({ orange: listSelected })} />
      </div>
      <div onClick={() => setListSelected(false)}>
        <Compass className={classnames({ orange: !listSelected })} />
      </div>
    </footer>
  );
};

export default VanList;
