//aws-sdk for node
const aws = require("aws-sdk");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

aws.config.update({
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: process.env.region,
});

const s3 = new aws.S3();

//import multer

//make multer ready for in-memory storage of uploaded file
const multerMemoryStorage = multer.memoryStorage();
const multerUploadInMemory = multer({
  storage: multerMemoryStorage,
});

// @route POST api/profile/image
// @desc POST a new profile picture
// @access Private
router.post(
  "/image",
  [auth, multerUploadInMemory.single("file")],
  (req, res) => {
    // multerUploadInMemory midleware populates request with a file object containing information about the processed file
    if (!req.file || !req.file.buffer) {
      throw new Error("File or buffer not found");
    }
    // uploads file to s3 bucket
    s3.upload(
      {
        Bucket: process.env.bucket,
        Key: `profile-Pics/${Date.now().toString()}.${
          req.file.mimetype.split("/")[1]
        }`,
        Body: req.file.buffer,
        ACL: "public-read",
      },
      (err, file) => {
        if (err) {
          console.error(`ERROR: ${err.message}`);
          res.status(500).send({ message: err.message });
        }
        // changes users profile picture to new image
        User.findById(req.user.id)
          .then(async (user) => {
            user.imageUrl = file.Location;
            await user.save();
            console.log(`Upload Successful!`);
            res.json({ message: "file uploaded" });
          })
          .catch((err) => {
            throw err;
          });
      }
    );
  }
);

// @route GET api/profile/followers/:username
// @desc GET followers + following of a user
// @access Public
router.get("/followers/:username", (req, res) => {
  const { username } = req.params;
  User.findOne({ username })
    .then((user) =>
      res
        .status(200)
        .json({ following: user.following, followers: user.followers })
    )
    .catch((err) => {
      res.status(404).json({ msg: "user not found" });
    });
});

// @route POST api/profile/follow
// @desc Follow a user from body
// @access Private
router.post("/follow", auth, (req, res) => {
  const { username } = req.body;
  if (username == req.user.username) {
    return res.status(403).json({ msg: "cannot follow yourself" });
  }
  User.findOne({ username })
    .then((user) => {
      if (user.followers.includes(req.user.username)) {
        return res.status(403).json({ msg: "already following" });
      }
      user.followers.push(req.user.username);
      user.save();
      User.findById(req.user.id)
        .then((currUser) => {
          currUser.following.push(username);
          currUser.save();
          res.status(200).json({ success: true });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// @route POST api/profile/unFollow
// @desc un follow a user from body
// @access Private
router.post("/unFollow", auth, (req, res) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((user) => {
      console.log(user);
      if (!user.followers.includes(req.user.username)) {
        return res.status(403).json({ msg: "Not already following" });
      }
      const i = user.followers.indexOf(req.user.username);
      user.followers.splice(i, 1);
      user.save();
      User.findById(req.user.id)
        .then((user) => {
          const i = user.following.indexOf(username);
          user.following.splice(i, 1);
          user.save();
          res.status(200).json({ success: true });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
