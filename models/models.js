const mongoose = require("mongoose");
const Picture = require("./pictureSchema");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pictures: {
      type: [Picture.schema]
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;