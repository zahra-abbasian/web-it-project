import React, { useState } from "react";
import { useHistory } from "react-router";
import NavBar from "../CommonModule/NavBar/NavBar";
import { loginVendor } from "../../../actions";
import "./Login.css";

function Login() {
  // remove previous session info
  localStorage.removeItem("token");

  return (
    <div className="login">
      <LoginForm loginVendor={loginVendor} />
    </div>
  );
}

function LoginForm({ loginVendor, error }) {
  const [details, setDetails] = useState({ name: "", password: "" });
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // authenticate vendor on log in
      await loginVendor(details);
      // if token exists login is successful
      const token = localStorage.getItem("token");
      token ? history.push("/vendor/location") : history.push("/vendor/login");
      document.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <NavBar />

      <div className="login-page-vendor">
        <div className="back-container">
          <button className="back-button" onClick={() => history.goBack()}>
            &lt; back
          </button>
        </div>
        <h1>Trukk Vendor App</h1>
        <form onSubmit={submitHandler}>
          {/* van name input for login */}
          <div className="form-inner">
            {error !== "" ? <div className="error">{error}</div> : ""}
            <div className="form-group">
              <label htmlFor="name">Van Name</label>
              <input
                type="name"
                name="name"
                id="name"
                onChange={(e) =>
                  setDetails((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }))
                }
                value={details.email}
              />
            </div>
            {/* password input for login */}
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
              {/* go to signup page */}
              <input
                onClick={() => {
                  history.push("/vendor/signup");
                }}
                value="SIGN UP"
                onChange={() => {}}
              />
              <input type="submit" value="LOGIN" onChange={() => {}} />
            </div>
            <div className="customer-login">
              {/* go to customer login page */}
              <input
                value="I'M A CUSTOMER"
                onClick={() => {
                  history.push("/login");
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
