import React, { useState, useContext } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import NavBar from "../CommonModule/NavBar/NavBar";
import { updateVanStatus } from "../../../actions/index";
import "./Location.css";
import { UserContext } from "../../../actions/UserContext";

const Location = () => {
  const user = useContext(UserContext);
  const history = useHistory();
  const [address, setAddress] = useState("");
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState({});

  // Gets the current geolocation of the vendor/device
  const getPosition = () => {
    return new Promise((success, error) => {
      navigator.geolocation.getCurrentPosition(success, error);
    });
  };

  // On submission, updates the vendor's status as ready and updates the location to the current
  // location
  const submitHandler = async (e) => {
    if (!user) {
      history.push("/login");
    }
    e.preventDefault();
    setReady(() => true);
    const position = await getPosition();
    setLocation(() => ({
      type: "Point",
      coordinates: [position.coords.longitude, position.coords.latitude],
    }));
    mutation.mutate();
    history.push(`/vendor/outstanding/${user?._id}`);
  };

  const mutation = useMutation(async () => {
    await updateVanStatus(user?._id, address, ready, location);
  });

  return (
    <>
      <NavBar />
      <div>
        <form onSubmit={submitHandler}>
          <div className="form-inner-location">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input onChange={(e) => setAddress(() => e.target.value)} />
            </div>
            <input
              type="submit"
              value="READY TO SERVE"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Location;
