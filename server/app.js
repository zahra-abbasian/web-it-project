require("dotenv").config();
require("./db");
const http = require("http");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const socketio = require("socket.io");
const passport = require("passport");
const userRoutes = require("./routes/passport/userRoutes");
const customerRoutes = require("./routes/customer/customerRoutes");
const vendorRoutes = require("./routes/vendor/vendorRoutes");
const orderRoutes = require("./routes/order/orderRoutes");
const vendorUserRoutes = require("./routes/passport/vendorUserRoutes");

require("./config/passport")(passport);
// initialise express server
const app = express();
// enable cors for use of api in client
app.use(cors());
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    methods: ["GET", "POST"],
    credentials: true,
  },
});
require("./config/sockets")(io);
app.set("io", io);

server.listen(port, () => {
  console.log(`The server is listening on port ${port}!`);
});

// specify that we expect json to be received
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup a session store signing the contents using the secret key
app.use(
  session({
    secret: process.env.PASSPORT_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// initialise our customer + vendor + user routes
app.use("/customer", customerRoutes);
app.use("/vendor", vendorRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/vendor-user", vendorUserRoutes);

// bad request error handling
app.use((req, _, next) => {
  const err = new Error(`Route: ${req.originalUrl} does not exist.`);
  err.status = 404;
  next(err);
});

// general error handling
app.use((err, req, res, _) => {
  // Handling invalid req.params.id or invalid geolocation (16755)
  if (
    err?.name === "CastError" ||
    err?.name === "ValidationError" ||
    err?.code === 16755
  ) {
    err.status = 400;
    err.message = "Bad Request";
  }
  res.status(err.status || 500).json({
    status: "fail",
    error: err.message,
  });
});

module.exports = {
  app,
  server,
};
