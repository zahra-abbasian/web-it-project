import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./components/Customer/Login/Login";
import Signup from "./components/Customer/Signup/Signup";
import OrderPage from "./components/Customer/Order/OrderPage";
import Menu from "./components/Customer/Menu/Menu";
import VanList from "./components/Customer/VanList/VanList";
import ViewOrder from "./components/Customer/ViewOrder/ViewOrder";
import OutstandingOrder from "./components/Vendor/OutstandingOrder/OutstandingOrder";
import VendorLocation from "./components/Vendor/Location/Location";
import VendorLogin from "./components/Vendor/Login/Login";
import VendorSignup from "./components/Vendor/Signup/Signup";
import ErrorPage from "./components/ErrorPage";
import OutstandingDetails from "./components/Vendor/OutstandingOrderDetails/OutstandingOrderDetails";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContext } from "./actions/UserContext";
import CustomerDetails from "./components/Customer/CustomerDetails/CustomerDetails";
import { getUser } from "./actions/";
import FulfilledList from "./components/Vendor/FulfilledList/FulfilledList";
import { getVendor } from "./actions/";

const queryClient = new QueryClient();

function App() {
  // get vendor token to be accessed by all components
  const [user, setUser] = useState();
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      return;
    }
    let getUserWithJwt;
    if (window.location.href.includes("vendor")) {
      getUserWithJwt = async () => {
        const user = await getVendor(jwt);
        setUser(user?.body);
      };
    } else {
      getUserWithJwt = async () => {
        const user = await getUser(jwt);
        setUser(user?.body);
      };
    }
    getUserWithJwt();
  }, [setUser]);

  return (
    // react query provider
    <QueryClientProvider client={queryClient}>
      {/* provide session information to all components */}
      <UserContext.Provider value={user}>
        <Router>
          <Switch>
            {/* redirect to main page if already logged in */}
            <Route exact path="/">
              <Redirect to="/trucks" />
            </Route>
            {/* customer pages */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/user" component={CustomerDetails} />
            <Route path="/trucks" component={VanList} />
            <Route path="/menu" component={Menu} />
            <Route path="/order/:id" component={OrderPage} />
            <Route path="/order/" component={OrderPage} />
            <Route path="/view-order/:id" component={ViewOrder} />
            {/* vendor pages */}
            <Route path="/vendor/login" component={VendorLogin} />
            <Route path="/vendor/signup" component={VendorSignup} />
            <Route path="/vendor/location" component={VendorLocation} />
            <Route
              path="/vendor/outstanding/:vendorId/:id"
              component={OutstandingDetails}
            />
            <Route
              path="/vendor/orders/fulfilled/:id"
              component={FulfilledList}
            />
            <Route
              path="/vendor/outstanding/:id"
              component={OutstandingOrder}
            />
            {/* if the user tries to access a route which doesn't exist, display an error */}
            <Route path="*" component={ErrorPage} />
          </Switch>
        </Router>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
