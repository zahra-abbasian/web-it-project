import React, { useContext, useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { useHistory } from "react-router";
import "./CustomerDetails.css";
import { UserContext } from "../../../actions/UserContext";
import { useMediaQuery } from "react-responsive";
import { updateCustomerInfo } from "../../../actions";
import { useMutation } from "react-query";

const CustomerDetails = () => {
  const history = useHistory();

  // logout the user
  const logoutHandler = () => {
    // remove token from the local storage
    localStorage.removeItem("token");
    window.localStorage.removeItem("currentOrder");
    window.localStorage.removeItem("truck");
    // redirect to login page
    history.push("/login");
    // force reload the page
    document.location.reload();
  };
  const user = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({
    name: "",
    nameFamily: "",
    password: "",
    confirmPassword: "",
  });

  // update details
  const mutation = useMutation(async () => {
    const { name, nameFamily, password } = userDetails;
    await updateCustomerInfo(user._id, name, nameFamily, password);
  });

  useEffect(() => {
    // update information in state
    if (user) {
      const { name, nameFamily } = user;
      setUserDetails({ name, nameFamily, password: "", confirmPassword: "" });
    }
  }, [user]);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    // add strong password validation
    const strongPassword = new RegExp("(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})");
    // error feedback on bad details
    if (
      !userDetails.name ||
      !userDetails.nameFamily ||
      !userDetails.password ||
      !userDetails.confirmPassword
    ) {
      alert("All fields must not be empty!");
      return;
    } else if (!userDetails.password.match(strongPassword)) {
      alert("Your password isn't strong enough.");
      return;
    } else if (userDetails.password !== userDetails.confirmPassword) {
      alert("Passwords must match!");
      return;
    }
    mutation.mutate();
    history.goBack();
  };

  return (
    <div>
      <NavBar
        capsuleColour="grey"
        before={
          <button
            className={isDesktopOrLaptop ? "logout-desktop" : "logout-mobile"}
            // add logout handler to the navbar on this page
            onClick={logoutHandler}
          >
            Log Out
          </button>
        }
        // add button to access orders list for user
        after={
          <button
            className={
              isDesktopOrLaptop
                ? "logout-desktop orders-button"
                : "logout-mobile"
            }
            onClick={() => {
              history.push(`/view-order/${user?._id}`);
            }}
          >
            orders
          </button>
        }
        isCustomerPage
        text={`${userDetails?.name}'s details`}
      />
      {/* render the back button if on desktop sized screens */}
      {isDesktopOrLaptop && (
        <div className="back-container">
          <button className="back-button" onClick={() => history.goBack()}>
            &lt; back
          </button>
        </div>
      )}

      <div className="user-container">
        <div className="edit-container">
          <div>
            <h1 className="edit-header">Edit your details</h1>
            <form onSubmit={submitHandler}>
              <div
                className={`details-inner-${
                  isDesktopOrLaptop ? "desktop" : "mobile"
                }`}
              >
                {/* input for user's given name */}
                <div className="details-group">
                  <label>Given name(s)</label>
                  <input
                    type="text"
                    name="givenName"
                    id="givenName"
                    onChange={(e) =>
                      setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        name: e.target.value,
                      }))
                    }
                    value={userDetails.name}
                  />
                </div>
                {/* input for user's family name */}
                <div className="details-group">
                  <label>Family name</label>
                  <input
                    type="text"
                    name="familyName"
                    id="familyName"
                    onChange={(e) => {
                      setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        nameFamily: e.target.value,
                      }));
                    }}
                    value={userDetails.nameFamily}
                  />
                </div>
                {/* input for user's password */}
                <div className="details-group">
                  <label htmlFor="Password">
                    New password (min. 8 characters, 1 letter, 1 num. digit)
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="new-password"
                    onChange={(e) => {
                      setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        password: e.target.value,
                      }));
                    }}
                    value={userDetails.password}
                  />
                </div>
                {/* input for user's password confimration */}
                <div className="details-group">
                  <label htmlFor="Password">Re-type password</label>
                  <input
                    type="password"
                    name="retypePassword"
                    id="retype-password"
                    onChange={(e) => {
                      setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        confirmPassword: e.target.value,
                      }));
                    }}
                    value={userDetails.confirmPassword}
                  />
                </div>
              </div>

              <button className="edit-confirm" type="submit">
                CONFIRM
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
