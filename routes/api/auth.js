const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const jwtSecret = process.env.jwtSecret;

// Item Model
const User = require("../../models/User");

// @route POST api/auth
// @desc Authorises User
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
          if (!isMatch) {
            return res.status(400).json({ msg: "invalid password" });
          }
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

// @route POST api/auth/changePassword
// @desc change Users password
// @access Private
router.post("/changePassword", auth, (req, res) => {
  username = req.user.username;
  [newPass, oldPassEntered] = [req.body.newPass, req.body.oldPassEntered];
  User.findOne({ username })
    .then((user) => {
      bcrypt
        .compare(oldPassEntered, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ msg: "password Incorrect" });
          }
          bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500);
            bcrypt.hash(newPass, salt, (err, hash) => {
              user.password = hash;
              user
                .save()
                .then((user) => {
                  return res.status(200).json({ msg: "password changed" });
                })
                .catch((err) => {
                  return res.status(500);
                });
            });
          });
        })
        .catch((err) => {
          res.status(500);
        });
    })
    .catch((err) => {
      res.status(500);
    });
});

// @route GET api/auth/email
// @desc GET verification code
// @access Public
router.get("/email/:email", (req, res) => {
  const email = req.params.email;
  const randomCode = Math.floor(Math.random() * Math.floor(10000));

  const transporter = nodemailer.createTransport({
    service: process.env.botService,
    auth: {
      user: process.env.botEmail,
      pass: process.env.botPass,
    },
  });

  const mailOptions = {
    from: process.env.botEmail,
    to: email,
    subject: "Confirmation Code",
    text: `Your verification code is: ${randomCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ code: randomCode });
    }
  });
});

module.exports = router;
