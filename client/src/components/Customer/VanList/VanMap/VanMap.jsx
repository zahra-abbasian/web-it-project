import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useHistory } from "react-router";
import { addTruckPins, initMap } from "../../../../utils/map";
import "./VanMap.css";

const TruckMap = ({ truckList, userLocation }) => {
  const [map, setMap] = useState();
  const [truckPins, setTruckPins] = useState();

  const mapContainerRef = useRef(null);
  const history = useHistory();
  useEffect(() => {
    if (map || !userLocation) {
      return;
    }
    // initialise the mapbox map
    const mapInstance = initMap({
      mapboxAccessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      mapContainerRef,
      center: [userLocation.coords.longitude, userLocation.coords.latitude],
    });
    setMap(mapInstance);
  }, [map, mapContainerRef, userLocation]);

  useEffect(() => {
    if (!map || truckPins) {
      return;
    }
    // add truck pins to the map for each nearby truck
    setTruckPins(addTruckPins({ truckList, map, history }));
    map.resize();
  }, [map, truckList, truckPins, history]);

  useEffect(() => {
    // center the map on the user's location and add a marker at their location
    if (userLocation && userLocation.coords && map) {
      const location = [
        userLocation.coords.longitude,
        userLocation.coords.latitude,
      ];
      const youMarkerEl = document.createElement("div");
      youMarkerEl.className = "you-marker";
      new mapboxgl.Marker(youMarkerEl).setLngLat(location).addTo(map);
      map.flyTo({
        center: location,
        zoom: 12,
        speed: 2,
      });
    }
  }, [userLocation, map]);

  return <div ref={mapContainerRef} id="tab-map-component" />;
};

export default TruckMap;
