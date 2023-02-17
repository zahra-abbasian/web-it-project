import React, { useState } from "react";
import { useHistory } from "react-router";
import NavBar from "../CommonModule/NavBar/NavBar";
import { signupVendor } from "../../../actions";
import "./Signup.css";

function Signup() {
  // remove previous session info
  localStorage.removeItem("token");

  return (
    <div className="signup">
      <SignupForm signupVendor={signupVendor} />
    </div>
  );
}

function SignupForm({ signupVendor, error }) {
  const [details, setDetails] = useState({
    name: "",
    password: "",
    address: "",
  });
  const history = useHistory();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // authenticate vendor on log in
      await signupVendor(details);
      // if token exists login is successful
      const token = localStorage.getItem("token");
      token ? history.push("/vendor/location") : history.push("/vendor/signup");
      document.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="signup-page-desktop">
        <h1>Trukk Vendor App</h1>
        <form onSubmit={submitHandler}>
          <div className="form-inner-desktop">
            {error !== "" ? <div className="error">{error}</div> : ""}
            {/* vendor can enter their van name */}
            <div className="form-group">
              <label htmlFor="name">Van Name</label>
              <input
                type="name"
                name="name"
                id="name"
                onChange={(e) => {
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }));
                }}
                value={details.name}
              />
            </div>
            {/* password validation for vendor */}
            <div className="form-group">
              <label htmlFor="Password">
                Password (min. 8 characters, 1 letter, 1 numerical digit)
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => {
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    password: e.target.value,
                  }));
                }}
                value={details.password}
              />
            </div>
            <input type="submit" value="SIGN UP" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
