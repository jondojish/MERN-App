const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/keys").jwtSecret;

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
    req.user = decoded;
    next();
  });
};

module.exports = auth;
