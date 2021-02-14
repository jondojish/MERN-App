require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const messages = require("./routes/api/messages");

const imageUpload = require("./imageUpload");

const app = express();

// Body parser
app.use(express.json());

// DB Config
const db = process.env.mongoURI;

// Connect to Mongo

const mongoUser = require("./config/mongoUser");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  user: process.env.mongoUser,
  pass: process.env.mongoPass,
};

mongoose
  .connect(db, options)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/messages", messages);
app.use("/api/", imageUpload);

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);
