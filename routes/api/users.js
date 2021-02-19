const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
mongoose = require("mongoose");

const jwtSecret = process.env.jwtSecret;

// User Model
const User = require("../../models/User");

// @route GET api/users
// @desc Get logged in user info
// @access Private
router.get("/", auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(500));
});

// @route GET api/users/:username
// @desc Get info of requested user
// @access Public
router.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "user not found" });
      }
      return res.status(200).json({
        username: user.username,
        imageUrl: user.imageUrl,
        followers: user.followers,
        following: user.following,
      });
    })
    .catch((err) => res.status(500));
});

// @route GET api/users/search/:username
// @desc Get users based on partial username
// @access Private
router.get("/search/:nameSearched", auth, (req, res) => {
  nameSearched = req.params.nameSearched;
  username = req.user.username;
  names = [];
  User.find({})
    .then((users) => {
      users.map((user) => {
        if (user.username.includes(nameSearched) && user.username != username) {
          names.push({ username: user.username, imageUrl: user.imageUrl });
        }
      });
      return res.status(200).json(names);
    })
    .catch((err) => res.status(500));
});

// @route POST api/users
// @desc Create new user
// @access Public
router.post("/", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findOne({ $or: [{ username }, { email }] })
    .then((user) => {
      if (user) {
        return res.status(403).json({ msg: "User already exists" });
      }

      const newUser = new User({
        username,
        password,
        email,
      });
      // Uses a salt to hash password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              // creates jwt token
              token = jwt.sign(
                {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  imageUrl: user.imageUrl,
                },
                jwtSecret
              );

              res.json({
                token,
                id: user.id,
                username: user.username,
                email: user.email,
              });
            })
            .catch(() => {
              return res.status(400).json({ msg: "error1" });
            });
        });
      });
    })
    .catch(() => {
      return res.status(400).json({ msg: "error2" });
    });
});

// @route DELETE api/users
// @desc DELETE user
// @access Public
router.delete("/", auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) => user.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ error: "id not found" }));
});

// @route GET api/users/taken:username:email
// @desc Checks if username or email is taken
// @access public
router.get("/taken/:username/:email", (req, res) => {
  const { username, email } = req.params;
  User.find({ $or: [{ username }, { email }] })
    .then((users) => {
      if (users.length == 0) return res.status(200).json({ taken: false });
      return res.status(200).json({ taken: true });
    })
    .catch((err) => {
      res.status(500);
    });
});

module.exports = router;
