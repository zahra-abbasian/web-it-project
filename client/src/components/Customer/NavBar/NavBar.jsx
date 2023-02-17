import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import TrukkLogo from "../../svg/TrukkLogo";
import YellowPaint from "../../svg/YellowPaint";
import Avatar from "../../svg/Avatar";
import AccountButton from "./AccountButton/AccountButton";
import Capsule from "./Capsule/Capsule";
import { UserContext } from "../../../actions/UserContext";
import { getCustomerExistingOrder } from "../../../actions/";
import "./NavBar.css";

const NavBar = ({
  before = undefined,
  after = undefined,
  text = "",
  capsuleColour = "grey",
  isCustomerPage = false,
}) => {
  const history = useHistory();
  const user = useContext(UserContext);

  const [customer, setCustomer] = useState();

  useEffect(() => {
    setCustomer(user?._id);
  }, [user]);

  useEffect(() => {
    const fetchCustomerOrder = async () => {
      if (user) {
        const outstandingOrder = await getCustomerExistingOrder(user?._id);
        if (outstandingOrder) {
          console.log(outstandingOrder);
          window.localStorage.setItem(
            "currentOrder",
            JSON.stringify(outstandingOrder)
          );
        }
      }
    };
    fetchCustomerOrder();
  }, [user, history]);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  return (
    <nav>
      {/* change look based on screen size */}
      {isDesktopOrLaptop ? (
        <div className="top-nav-desktop">
          <TrukkLogo
            onClick={() => {
              history.push("/trucks");
              document.location.reload();
            }}
            className="logo-desktop-cust logo-link"
            width={198}
            height={78}
          />

          <div className="capsule-container">
            <Capsule
              before={before}
              after={after}
              capsuleColour={capsuleColour}
              text={text}
              isCustomerPage={isCustomerPage}
            />
          </div>
          {/* if logged in provide button to view orders, otherwise provide login button */}
          {customer ? (
            <div className="logged-in-buttons-desktop">
              {isCustomerPage && before}

              <Avatar
                onClick={() => {
                  history.push("/user");
                }}
                className="avatar"
              />
              {isCustomerPage && after}
            </div>
          ) : (
            <>
              <Link className="login-link-desktop" to="/login">
                <AccountButton
                  className="account-button-desktop"
                  text={"log in"}
                />
              </Link>
            </>
          )}
          <YellowPaint className="paint-desktop" width={600} height={100} />
        </div>
      ) : (
        <>
          <div className="top-nav-mobile">
            <TrukkLogo
              className="logo-mobile logo-link"
              onClick={() => {
                history.push("/trucks");
                document.location.reload();
              }}
            />

            {customer ? (
              <div>
                <Avatar
                  size={45}
                  onClick={() => {
                    history.push("/user");
                  }}
                  className="avatar-mobile"
                />
              </div>
            ) : (
              <Link className="login-link-mobile" to="/login">
                <AccountButton text={"log in"} />
              </Link>
            )}
            <YellowPaint className="paint-mobile" />
          </div>
          <div className="bottom-nav-mobile">
            <Capsule
              before={before}
              after={after}
              capsuleColour={capsuleColour}
              text={text}
            />
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
