//aws-sdk for node
const aws = require("aws-sdk");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("./middleware/auth");
const User = require("./models/User");

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

router.use(auth);

// @route POST api/profile/image
// @desc POST a new profile picture
// @access Private
router.post("/image", multerUploadInMemory.single("file"), (req, res) => {
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
          console.log(file.Location);
          console.log(user);
          console.log(`Upload Successful!`);
          res.json({ message: "file uploaded" });
        })
        .catch((err) => {
          throw err;
        });
    }
  );
});

module.exports = router;
