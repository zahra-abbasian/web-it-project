// set up db connection
require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.CONNECTION_URL || "mongodb://localhost:27017/Trukk";

// connect to the DB
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  dbName: "Trukk",
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", () => {
  console.log("connected to MongoDB!");
});

module.exports = db;
