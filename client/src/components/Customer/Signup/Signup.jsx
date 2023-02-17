import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import TrukkLogo from "../../svg/TrukkLogo";
import YellowPaint from "../../svg/YellowPaint";
import { useMediaQuery } from "react-responsive";
import { signupUser } from "../../../actions";
import "./Signup.css";

function Signup() {
  // remove previous session info
  localStorage.removeItem("token");
  window.localStorage.removeItem("currentOrder");

  return (
    <div className="signup">
      <SignupForm signupUser={signupUser} />
    </div>
  );
}

function SignupForm({ signupUser, error }) {
  const [details, setDetails] = useState({
    email: "",
    password: "",
    name: "",
    nameFamily: "",
  });
  const history = useHistory();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // authenticate user on signup
      await signupUser(details);

      // if token exists signup is successful
      const token = localStorage.getItem("token");
      token ? history.push("/trucks") : history.push("/signup");
      document.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  return (
    <>
      <div
        className={`signup-page-${isDesktopOrLaptop ? "desktop" : "mobile"}`}>
        {/* signup page logo section */}
        <div className="logo">
          <Link to="/trucks">
            <TrukkLogo className="trukk-logo" width={297} height={117} />
          </Link>
          <YellowPaint
            className="paint"
            width={isDesktopOrLaptop ? 1200 : 900}
            height={160}
          />
          {/* only render on large screens */}
          {isDesktopOrLaptop && <h2>the food truck experience</h2>}
        </div>
        <form onSubmit={submitHandler}>
          <div
            style={{ marginTop: "7rem" }}
            className={`form-inner-customer-${
              isDesktopOrLaptop ? "desktop" : "mobile"
            }`}>
            {error !== "" ? <div className="error">{error}</div> : ""}
            <div className="form-group">
              <label htmlFor="name">Given name(s)</label>
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
            <div className="form-group">
              <label htmlFor="nameFamily">Family name</label>
              <input
                type="nameFamily"
                name="nameFamily"
                id="nameFamily"
                onChange={(e) => {
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    nameFamily: e.target.value,
                  }));
                }}
                value={details.nameFamily}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Login ID (Email address)</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) =>
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    email: e.target.value,
                  }))
                }
                value={details.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Password">Password (min. 8 characters, 1 letter, 1 numerical digit)</label>
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
