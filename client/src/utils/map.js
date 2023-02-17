/* eslint-disable import/no-webpack-loader-syntax */
import mapboxgl from "!mapbox-gl";

// add truck pins to the map for our top 5 trucks
export const addTruckPins = ({ truckList, map, history }) => {
  return truckList.map((truck) => {
    const { location } = truck;
    const vanMarkerEl = document.createElement("div");
    // set classname to apply image
    vanMarkerEl.className = "van-marker";
    // create a new market at the van's location
    const marker = new mapboxgl.Marker(vanMarkerEl)
      .setLngLat(location.coordinates)
      .addTo(map);
    // upon clicking the market, redirect to menu
    marker.getElement().addEventListener("click", () => {
      history.push({ pathname: "/menu", state: truck });
    });
    return marker;
  });
};

// initialise the map using mapbox
export const initMap = ({ mapContainerRef, center, mapboxAccessToken }) => {
  mapboxgl.accessToken = mapboxAccessToken;
  // create the map
  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    center,
    zoom: 12,
    style: "mapbox://styles/mapbox/light-v10",
    attributionControl: false,
  });
  // add cooler attribution controls
  map.addControl(
    new mapboxgl.AttributionControl({
      compact: true,
    })
  );
  map.on("load", () => {
    map.addControl(
      new mapboxgl.NavigationControl({
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right"
    );
  });
  return map;
};
