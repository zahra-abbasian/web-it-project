import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import TrukkLogo from "../../svg/TrukkLogo";
import YellowPaint from "../../svg/YellowPaint";
import { useMediaQuery } from "react-responsive";
import { loginUser } from "../../../actions";
import "./Login.css";

function Login() {
  // remove previous session info
  localStorage.removeItem("token");
  window.localStorage.removeItem("currentOrder");

  return (
    <div className="login">
      <LoginForm loginUser={loginUser} />
    </div>
  );
}

function LoginForm({ loginUser, error }) {
  const [details, setDetails] = useState({ email: "", password: "" });
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // authenticate user on login
      await loginUser(details);
      // if token exists login is successful
      const token = localStorage.getItem("token");
      token ? history.push("/trucks") : history.push("login");
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
      <div className={`login-page-${isDesktopOrLaptop ? "desktop" : "mobile"}`}>
        {/* login page logo section */}
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
            style={{ marginTop: isDesktopOrLaptop && 70 }}
            className={`form-inner-${isDesktopOrLaptop ? "desktop" : "mobile"}`}
          >
            {error !== "" ? <div className="error">{error}</div> : ""}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
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
              <label htmlFor="Password">Password</label>
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

            <div className="login-buttons">
              <input
                onClick={() => {
                  history.push("/signup");
                }}
                value="SIGN UP"
                onChange={() => {}}
              />
              <input type="submit" value="LOGIN" onChange={() => {}} />
            </div>
            <div className="vendor-login">
              <input
                value="I'M A VENDOR"
                onClick={() => {
                  history.push("/vendor/login");
                }}
                onChange={() => {}}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
