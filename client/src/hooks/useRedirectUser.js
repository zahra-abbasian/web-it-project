import { useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../actions/UserContext";

const useRedirectUser = () => {
  const user = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    // if the user has a "nameFamily" they are a customer, so direct to a customer route
    if (user && user.nameFamily) {
      history.push("/trucks");
    }
  }, [user, history]);
};

export default useRedirectUser;
