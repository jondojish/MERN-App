const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// Message Model
const Message = require("../../models/Message");

// @route GET api/messages/names
// @desc Get names of people who sent messages to user or user sent messages to
// @access Private
router.get("/names", auth, (req, res) => {
  const username = req.user.username;
  let alreadyAdded = [];
  let names = [];
  Message.find({ $or: [{ sender: username }, { recipient: username }] })
    .then(async (messages) => {
      for (msg of messages) {
        if (msg.sender != username && !alreadyAdded.includes(msg.sender)) {
          user = await User.findOne({ username: msg.sender });
          imageUrl = user.imageUrl;
          names.push({ username: msg.sender, imageUrl });
          alreadyAdded.push(msg.sender);
        }
        if (
          msg.recipient != username &&
          !alreadyAdded.includes(msg.recipient)
        ) {
          user = await User.findOne({ username: msg.recipient });
          imageUrl = user.imageUrl;
          names.push({ username: msg.recipient, imageUrl });
          alreadyAdded.push(msg.recipient);
        }
      }
      res.status(200).json(names);
    })
    .catch((err) => res.status(500));
});

// @route GET api/messages/names/:nameSearched
// @desc Get names of people messaged via a partial name
// @access Private
router.get("/names/:nameSearched", auth, (req, res) => {
  const username = req.user.username;
  const nameSearched = req.params.nameSearched;
  let alreadyAdded = [];
  let names = [];
  Message.find({
    $or: [{ sender: username }, { recipient: username }],
  })
    .then((messages) => {
      for (msg of messages) {
        if (
          msg.sender != username &&
          msg.sender.includes(nameSearched) &&
          !alreadyAdded.includes(msg.sender)
        ) {
          names.push({ username: msg.sender, imageUrl: msg.senderImageUrl });
          alreadyAdded.push(msg.sender);
        }
        if (
          msg.recipient != username &&
          msg.recipient.includes(nameSearched) &&
          !alreadyAdded.includes(msg.recipient)
        ) {
          names.push({
            username: msg.recipient,
            imageUrl: msg.recipientImageUrl,
          });
          alreadyAdded.push(msg.recipient);
        }
      }
      res.status(200).json(names);
    })
    .catch((err) => {
      res.status(500);
    });
});

// @route GET api/messages
// @desc Get all messages from certain user
// @access Private
router.get("/:senderName", auth, (req, res) => {
  const allMessages = {};
  const [username, sender] = [req.user.username, req.params.senderName];

  Message.find({
    $or: [
      { sender: username, recipient: sender },
      { sender: sender, recipient: username },
    ],
  })
    .sort("-date")
    .then((allMessages) => res.status(200).json(allMessages))
    .catch((err) => res.status(500));
});

// @route POST api/messages
// @desc Send message to specific user
// @access Private
router.post("/", auth, (req, res) => {
  const [username, recipient, message] = [
    req.user.username,
    req.body.recipient,
    req.body.message,
  ];
  User.findOne({ username: recipient })
    .then((recipient) => {
      senderImageUrl = req.user.imageUrl;
      recipientImageUrl = recipient.imageUrl;
      newMessage = new Message({
        sender: username,
        senderImageUrl,
        recipient: recipient.username,
        recipientImageUrl,
        message,
      });
      newMessage
        .save()
        .then((newMessage) => {
          return res.status(200).json({ message: newMessage });
        })
        .catch((err) => {
          console.log(err.message);
          return res.status(500);
        });
    })
    .catch((err) => {
      return res.status(500);
    });
});

module.exports = router;
