// Based on Week 9 demo files (FoodBuddy API)

require("dotenv").config();

const LocalStrategy = require("passport-local").Strategy;

// our user model
const User = require("../models/customer");
// our vendor model
const Van = require("../models/van");

// JSON Web Tokens
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// regex to check all passwords follow policy:
// min 8 characters, 1 alphabetical char, 1 numerical digit
const strongPassword = new RegExp("(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})");

module.exports = function (passport) {
  // used by passport to store information in and retrieve data from sessions
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (_id, done) {
    User.findById(_id, function (err, user) {
      done(err, user);
    });
  });

  // takes in username and password from login form
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          // see if the user with the email exists
          User.findOne({ email: email }, function (err, user) {
            // if there are errors, user is not found or password doesn't match
            if (err) return done(err);

            if (!user) return done(null, false);

            if (!user.validPassword(password)) {
              return done(null, false);
            }
            // otherwise, put the user's email in the session
            else {
              req.session.email = email;
              return done(null, user);
            }
          });
        });
      }
    )
  );

  // for signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        nameField: "name",
        nameFamilyField: "nameFamily",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          User.findOne({ email: email }, function (err, existingUser) {
            // search a user by the username (email in our case)
            if (err) {
              console.log(err);
              return done(err);
            }
            // if password isn't strong or email is already taken, return
            // message describing the issue
            if (!password.match(strongPassword)) {
              return done(null, {
                message: "Your password isn't strong enough.",
              });
            }
            if (existingUser) {
              return done(null, {
                message: "That email is already taken.",
              });
            } else {
              // otherwise create a new user
              var newUser = new User();

              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              newUser.nameFamily = req.body.nameFamily;
              newUser.name = req.body.name;
              newUser.orders = [];

              // and save the user
              newUser.save(function (err) {
                if (err) throw err;

                return done(null, newUser);
              });
              req.session.email = email;
            }
          });
        });
      }
    )
  );

  // to check that the client has a valid token
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PASSPORT_KEY,
        passReqToCallback: true,
      },
      (req, jwt_payload, done) => {
        // passport will put the decrypted token in jwt_payload variable
        User.findOne({ email: jwt_payload.body._id }, (err, user) => {
          if (err) {
            return done(err, false);
          }
          // if found, provide user instance to passport
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );

  // passport middleware to handle User login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // find the user associated with the email provided
          await User.findOne({ email: email }, function (err, user) {
            // if user is not found or there are other errors
            if (err) return done(err);
            if (!user) return done(null, false, { message: "No user found." });
            // user is found but the password doesn't match
            if (!user.validPassword(password)) {
              return done(null, false, { message: "Oops! Wrong password." });
            }
            // otherwise, provide user instance to passport
            else {
              return done(null, user, { message: "Login successful" });
            }
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // passport middleware to handle Vendor login
  passport.use(
    "vendor-login",
    new LocalStrategy(
      {
        usernameField: "name",
        passwordField: "password",
      },
      async (name, password, done) => {
        try {
          // find the vendor associated with the name provided
          await Van.findOne({ name: name }, function (err, user) {
            // if vendor is not found or there are other errors
            if (err) return done(err);
            if (!user)
              return done(null, false, { message: "No vendor found." });
            // vendor is found but the password doesn't match
            if (!user.validPassword(password)) {
              return done(null, false, { message: "Oops! Wrong password." });
            }
            // otherwise, provide user instance to passport
            else {
              return done(null, user, { message: "Login successful" });
            }
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // for signup
  passport.use(
    "vendor-signup",
    new LocalStrategy(
      {
        usernameField: "name",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, name, password, done) {
        process.nextTick(function () {
          Van.findOne({ name: name }, function (err, existingUser) {
            // search a user by the username (van name in our case)
            if (err) {
              console.log(err);
              return done(err);
            }
            // if password isn't strong or name is already taken, return
            // message describing the issue
            if (!password.match(strongPassword)) {
              return done(null, {
                message: "Your password isn't strong enough.",
              });
            }
            if (existingUser) {
              return done(null, {
                message: "That name is already taken.",
              });
            } else {
              // otherwise create a new vendor
              var newUser = new Van();

              newUser.name = name;
              newUser.password = newUser.generateHash(password);
              newUser.address = null;
              newUser.ready = false;
              newUser.location = null;

              // and save the vendor
              newUser.save(function (err) {
                if (err) throw err;

                return done(null, newUser);
              });
              req.session.name = name;
            }
          });
        });
      }
    )
  );
};
