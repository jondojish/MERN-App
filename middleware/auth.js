const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
const User = require("../models/User");

// Is called duiring redirect
auth = (req, res, next) => {
  const token = req.header("Authorization");
  // Check for token
  if (!token) {
    return res.status(401).json({ msg: "no token, authorisation denied" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ msg: "invalid token" });
    }
    User.findById(decoded.id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        res.status(500);
      });
  });
};

module.exports = auth;
