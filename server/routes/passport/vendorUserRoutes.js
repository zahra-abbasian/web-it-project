// Based on Week 9 demo files (FoodBuddy API)

require("dotenv").config();
const express = require("express");

const jwt = require("jsonwebtoken");
const { deserializeUser } = require("passport");

const passport = require("passport");
require("../../config/passport")(passport);

const vendorUserRouter = express.Router();

// POST login -- using JWT
vendorUserRouter.post("/login", async (req, res, next) => {
  passport.authenticate("vendor-login", async (err, user, info) => {
    try {
      if (err) {
        const error = new Error("An Error occurred");
        return next(error);
      }
      if (!user) {
        const error = new Error("Unable to find vendor with given details");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const { _id, name, address, ready, location } = user;
        const body = { _id, name, address, ready, location };

        // sign the JWT token and populate the payload with the vendor details
        const token = jwt.sign({ body }, process.env.PASSPORT_KEY);
        res.status(200);

        res.cookie("jwt", token, {
          httpOnly: false,
          sameSite: false,
          secure: true,
          domain: process.env.REACT_APP_SERVER_URL,
        });
        return res.json(token);
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// POST signup form -- signup a new vendor
vendorUserRouter.post("/signup", async (req, res, next) => {
  passport.authenticate("vendor-signup", async (err, user, info) => {
    try {
      if (err) {
        const error = new Error("An Error occurred");
        return next(error);
      }
      if (!user) {
        const error = new Error("Unable to signup with given details");
        return next(error);
      }
      // if there is message describing error
      if (user.message) {
        return res.json(user);
      }
      // otherwise login the new vendor
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const { _id, name, address, ready, location } = user;
        const body = { _id, name, address, ready, location };

        // sign the JWT token and populate the payload with the user details
        const token = jwt.sign({ body }, process.env.PASSPORT_KEY);

        res.status(200);

        res.cookie("jwt", token, {
          httpOnly: false,
          sameSite: false,
          secure: true,
          domain: process.env.REACT_APP_SERVER_URL,
        });

        return res.json(token);
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// GET login form
vendorUserRouter.get("/", (req, res) => {
  res.send({ login: "required" });
});

// GET vendor details associated with stored token
vendorUserRouter.get("/find", async (req, res) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) return res.json(false);
    const decoded = jwt.verify(token, process.env.PASSPORT_KEY);

    res.status(200).json({
      success: true,
      data: decoded,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = vendorUserRouter;
