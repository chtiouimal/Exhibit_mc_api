const mongoose = require("mongoose")

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
      default: "",
    },
    music: {
      type: String,
      required: [true, "Please enter the song's file"],
    },
    selected: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: -1,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

const Music = mongoose.model("Music", musicSchema)

module.exports = Music
