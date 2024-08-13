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
    thumbnail: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: "",
    },
    music: {
      type: String,
      // required: [true, "Please enter the song's file"],
      required: function () {
        return this.category === 0;
      },
      default: null,
    },
    video: {
      type: String,
      required: function () {
        return this.category === 3
      },
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
    category: {
      type: Number,
      required: [true, "Please select the category of your art"]
    }
  },
  { timestamps: true },
)

const Music = mongoose.model("Music", musicSchema)

module.exports = Music
