import React, { useContext } from "react";
import { useHistory } from "react-router";
import { useMutation } from "react-query";
import { updateVanReady } from "../../../../actions/index";
import TrukkLogo from "../../../svg/TrukkLogo";
import YellowPaint from "../../../svg/YellowPaint";
import { UserContext } from "../../../../actions/UserContext";
import "./NavBar.css";
import { useRedirectUser } from "../../../../hooks";

const NavBar = () => {
  const history = useHistory();
  const user = useContext(UserContext);

  // redirect customers to customer app
  useRedirectUser();

  const headingOut = () => {
    // remove token from the local storage
    localStorage.removeItem("token");
    mutation.mutate();
    history.push(`/vendor/login`);
    document.location.reload();
  };

  // change the van to be no longer ready for orders
  const mutation = useMutation(async () => {
    await updateVanReady(user?._id, false);
  });

  return (
    <nav>
      <div className="top-nav-desktop">
        <TrukkLogo className="logo-desktop" width={198} height={78} />
        {/* if logged in provide button to view orders, otherwise provide login button */}
        {user && (
          <button className="view-order-pad" onClick={headingOut}>
            Heading Out
          </button>
        )}
        <YellowPaint className="paint-pad" width={600} height={100} />
      </div>
    </nav>
  );
};

export default NavBar;
