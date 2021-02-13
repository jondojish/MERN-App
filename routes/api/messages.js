const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// Message Model
const Message = require("../../models/Message");

// @route GET api/messages
// @desc Get messages where sender or recipient is user
// @access Private
router.get("/", auth, (req, res) => {
  const userId = req.user.id;
  Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
    .then((messages) => res.status(200).json(messages))
    .catch((err) => res.status(500));
});

// @route POST api/messages
// @desc Send message
// @access Private
router.post("/", auth, (req, res) => {
  const [userId, recipientId, message] = [
    req.user.id,
    req.body.recipient,
    req.body.message,
  ];
  newMessage = new Message({ sender: userId, recipient: recipientId, message });
  newMessage
    .save()
    .then((message) => res.status(200).json(newMessage))
    .catch((err) => res.status(500));
});

module.exports = router;
