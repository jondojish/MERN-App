//aws-sdk for node
const aws = require("aws-sdk");
const express = require("express");
const Router = express.Router();
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

Router.use(auth);

Router.post("/image", multerUploadInMemory.single("file"), (req, res) => {
  if (!req.file || !req.file.buffer) {
    throw new Error("File or buffer not found");
  }
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

module.exports = Router;
