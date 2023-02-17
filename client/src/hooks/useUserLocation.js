import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState();
  useEffect(() => {
    if (!userLocation) {
      const handleSuccess = (pos) => {
        setUserLocation(pos);
      };
      navigator.geolocation.getCurrentPosition(handleSuccess, () => {}, {
        enableHighAccuracy: true,
      });
    }
  }, [userLocation]);
  return userLocation;
};

export default useUserLocation;
