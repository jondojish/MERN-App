const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true },
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true },
  },
  imageUrl: {
    type: String,
    default: process.env.defaultImg,
  },
  added: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
