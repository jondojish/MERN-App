const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// Message Model
const Message = require("../../models/Message");
const { eventNames } = require("../../models/User");

// @route GET api/messages
// @desc Get messages where sender or recipient is user
// @access Private

router.get("/names", auth, (req, res) => {
  const username = req.user.username;
  let alreadyAdded = [];
  let names = [];
  Message.find({ $or: [{ sender: username }, { recipient: username }] })
    .then((messages) => {
      for (msg of messages) {
        if (msg.sender != username && !alreadyAdded.includes(msg.sender)) {
          names.push({ username: msg.sender, imageUrl: msg.senderImageUrl });
          alreadyAdded.push(msg.sender);
        }
        if (
          msg.recipient != username &&
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
    .catch((err) => res.status(500));
});

// @route GET api/messages
// @desc Get messages from certain user
// @access Private
router.get("/", auth, (req, res) => {
  const allMessages = {};
  const [username, sender] = [req.user.username, req.body.sender];
  Message.find({
    $or: [
      { sender: username, recipient: sender },
      { recipient: username, sender: sender },
    ],
  })
    .then((messages) => res.status(200).json(messages))
    .catch((err) => res.status(500));

  Message.find({ sender: username, recipient: sender })
    .then((sentMessages) => (allMessages.sent = sentMessages))
    .catch((err) => res.status(500));
  Message.find({ sender: sender, recipient: username })
    .then((recievedMessages) => (allMessages.recieved = recievedMessages))
    .catch((err) => res.status(500));
});

// @route POST api/messages
// @desc Send message
// @access Private
router.post("/", auth, (req, res) => {
  const [username, recipient, message] = [
    req.user.username,
    req.body.recipient,
    req.body.message,
  ];
  console.log(req.body);
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
      console.log(newMessage);
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
