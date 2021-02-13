const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.jwtSecret;

// Item Model
const User = require("../../models/User");

// @route POST api/auth
// @desc Auth User
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }

      // Validate password
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch)
            return res.status(400).json({ msg: "invalid password" });
          token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            jwtSecret
          );
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
        })
        .catch(() => {
          return res.status(500);
        });
    })
    .catch(() => {
      return res.status(500);
    });
});

module.exports = router;
