const mongoose = require("mongoose");

const musicSchema = mongoose.Schema(
  {
    songName: {
      type: String,
      required: [true, "Please enter the song's name"],
    },
    songArtist: {
      type: String,
      required: [true, "Please enter the song's artist"],
    },
    coverArt: {
      type: String,
      required: [true, "Please enter the song's image"],
    },
    color: {
      type: String,
      required: [true, "Please select the song's background color"],
    },
    music: {
      type: String,
      required: [true, "Please enter the song's file"],
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Music = mongoose.model("Music", musicSchema);

module.exports = Music;
