const mongoose = require("mongoose");
<<<<<<< HEAD
const Picture = require("./pictureSchema");
=======
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430

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
<<<<<<< HEAD
      type: [Picture.schema]
=======
      type: Array
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;