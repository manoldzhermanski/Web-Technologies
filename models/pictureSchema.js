const { required } = require("joi");
const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const Picture = mongoose.model("Picture", PictureSchema);

module.exports = Picture;