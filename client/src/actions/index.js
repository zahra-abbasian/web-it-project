import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";

// add token to every request made to API
axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [BASE_URL];
    const token = localStorage.getItem("token");
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Snacks
export const getAllSnacks = async () => {
  return axios
    .get(`${BASE_URL}/customer/snacks`)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const getSnackDetails = (snackId) => {
  return axios
    .get(`${BASE_URL}/customer/snacks/${snackId}`)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

// Vendors
export const getVan = async (vanId) => {
  return axios
    .get(`${BASE_URL}/vendor/van/${vanId}`)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const updateVanStatus = (vendorId, address, ready, location) => {
  const body = {
    address,
    ready,
    location,
  };
  return axios
    .patch(`${BASE_URL}/vendor/van/status/${vendorId}`, body)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const updateVanReady = (vendorId, ready) => {
  const body = {
    ready,
  };
  return axios
    .patch(`${BASE_URL}/vendor/van/status/${vendorId}`, body)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

// Orders
export const createOrder = async (
  customerId,
  vendorId,
  fullSnacks,
  totalPrice
) => {
  const snacks = fullSnacks.map((snack) => ({
    snackId: snack.id,
    quantity: snack.quantity,
  }));
  const body = {
    customerId,
    vendorId,
    snacks,
    totalPrice,
  };
  return axios
    .post(`${BASE_URL}/customer/orders/`, body)
    .then((res) => res?.data?.data);
};

// Authenticate user login
export async function loginUser(user) {
  const { email, password } = user;

  if (!email || !password) {
    alert("Must provide an email and a password");
    return;
  }

  const endpoint = BASE_URL + `/user/login`;

  // POST the email and password to API to
  // authenticate user and receive the token explicitly
  let data = await axios({
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    ),
  })
    .then((res) => res.data)
    .catch(() => {
      alert("Email not found or password doesn't match.");
    });

  if (data) {
    // store token locally
    localStorage.setItem("token", data);
  }
}

// Get user associated with stored token
export const getUser = (jwt) => {
  const headers = {
    headers: { "x-auth-token": jwt },
  };
  return axios
    .get(`${BASE_URL}/user/find`, headers)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

// Authenticate user signup
export async function signupUser(user) {
  localStorage.removeItem("token");

  const { email, password, name, nameFamily } = user;

  if (!email || !password || !name || !nameFamily) {
    alert("must provide an email, a password, and a full name");
    return;
  }

  const endpoint = BASE_URL + `/user/signup`;
  // POST the email and password to API to
  // signup user and receive the token explicitly
  let data = await axios({
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(
      {
        email,
        password,
        name,
        nameFamily,
      },
      { withCredentials: true }
    ),
  })
    .then((res) => res.data)
    .catch(() => {
      return;
    });

  if (!data) {
    alert("Please try again with a different email or stronger password.");
  } else if (data.message) {
    // show error message
    alert(data.message);
  } else {
    // store token locally
    localStorage.setItem("token", data);
  }
}

export const createRating = (reqComment, reqValue, orderId) => {
  let comment = reqComment;
  const value = reqValue;
  if (!comment) {
    comment = "";
  }
  const body = {
    rating: {
      value,
      comment,
    },
  };
  return axios
    .patch(`${BASE_URL}/order/updateRating/${orderId}`, body)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const getOrderDetails = async (orderId) => {
  return axios
    .get(`${BASE_URL}/order/${orderId}`)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const cancelOrder = async (orderId) => {
  return axios
    .patch(`${BASE_URL}/customer/orders/cancel/${orderId}`)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const getAllCustomerOrders = async (customerId) => {
  return axios
    .get(`${BASE_URL}/customer/orders/${customerId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const getAllReadyVans = async () => {
  return axios
    .get(`${BASE_URL}/vendor/van/ready`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const getOneOutstandingOrder = (vendorId, orderId) => {
  return axios
    .get(`${BASE_URL}/vendor/orders/outstanding/${vendorId}/${orderId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const getCustomerExistingOrder = (customerId) => {
  return axios
    .get(`${BASE_URL}/customer/orders/customer/${customerId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch(() => { });
};

export const updateOrdersFulfilled = (orderId) => {
  return axios
    .patch(`${BASE_URL}/vendor/orders/updateFulfilled/${orderId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const updateOrdersFinished = (orderId) => {
  return axios
    .patch(`${BASE_URL}/customer/orders/finished/${orderId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const updateOrdersReady = (orderId) => {
  return axios
    .patch(`${BASE_URL}/vendor/orders/updateReady/${orderId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const applyOrderDiscount = (orderId, newTotalPrice) => {
  const body = {
    totalPrice: newTotalPrice,
  };
  return axios
    .patch(`${BASE_URL}/customer/orders/discount/${orderId}`, body)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const getAllOutstandingOrders = (vendorId) => {
  return axios
    .get(`${BASE_URL}/vendor/orders/outstanding/${vendorId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const getAllFulfilledOrders = (vendorId) => {
  return axios
    .get(`${BASE_URL}/vendor/orders/fulfilled/${vendorId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

export const changeOrderSnacks = (orderId, newSnacks, newPrice) => {
  const snacks = newSnacks.map((newSnack) => ({
    snackId: newSnack.id,
    quantity: newSnack.quantity,
  }));
  const body = {
    snacks,
    newPrice,
  };
  return axios
    .patch(`${BASE_URL}/customer/orders/change/${orderId}`, body)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

//customer
// Get user info associated with customer ID
export const getCustomerInfo = (customerId) => {
  return axios
    .get(`${BASE_URL}/customer/${customerId}`)
    .then((res) => {
      return res?.data?.data;
    })
    .catch((err) => console.log(err));
};

// Authenticate vendor login
export async function loginVendor(user) {
  const { name, password } = user;

  if (!name || !password) {
    alert("must provide a van name and a password");
    return;
  }

  const endpoint = BASE_URL + `/vendor-user/login`;

  // POST the name and password to API to
  // authenticate vendor and receive the token explicitly
  let data = await axios({
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(
      {
        name: name,
        password: password,
      },
      { withCredentials: true }
    ),
  })
    .then((res) => res.data)
    .catch((err) => {
      alert("Van name not found or password doesn't match.");
    });

  if (data) {
    // store token locally
    localStorage.setItem("token", data);
  }
}

// Get vendor associated with stored token
export const getVendor = (jwt) => {
  const headers = {
    headers: { "x-auth-token": jwt },
  };
  return axios
    .get(`${BASE_URL}/vendor-user/find`, headers)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

// Authenticate vendor signup
export async function signupVendor(user) {
  const { name, password } = user;

  if (!name || !password) {
    alert("must provide a van name and a password");
    return;
  }

  const endpoint = BASE_URL + `/vendor-user/signup`;
  // POST the name and password to API to
  // signup user and receive the token explicitly
  let data = await axios({
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(
      {
        name: name,
        password: password,
      },
      { withCredentials: true }
    ),
  })
    .then((res) => res.data)
    .catch(() => {
      return;
    });

  if (!data) {
    alert("Please try again with a different name or stronger password.");
  } else if (data.message) {
    // show error message
    alert(data.message);
  } else {
    // store token locally
    localStorage.setItem("token", data);
  }
}

export const updateCustomerInfo = async (
  customerId,
  name,
  nameFamily,
  password
) => {
  return axios
    .put(`${BASE_URL}/customer/${customerId}`, { name, nameFamily, password })
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};

export const getVanRating = async (vendorId) => {
  return axios
    .get(`${BASE_URL}/vendor/van/rating/${vendorId}`)
    .then((res) => res?.data?.data)
    .catch((err) => console.log(err));
};
