const express = require("express")
const sharp = require('sharp');
const axios = require('axios');
const Music = require("../models/musicModel");
const uploadToFirebase = require("../services/uploadService");
const withModel = require("../middleware/withModel");
const router = express.Router()



router.get("/musics", withModel({ Music: Music.schema }), async (req, res) => {
  try {
    const musics = await req.models.Music.find({})
    res.status(200).json(musics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/musics/selected", withModel({ Music: Music.schema }), async (req, res) => {
  try {
    const musics = await req.models.Music.find({})
    const selected = musics.filter((e) => e.selected === true)
    res.status(200).json(selected)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/music/:id", async (req, res) => {
  try {
    const { id } = req.params
    const music = await Music.findById(id)
    res.status(200).json(music)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/music", async (req, res) => {
  try {
      const { coverArt, ...otherFields } = req.body;
            // Fetch the original cover art image from the cloud
      const response = await axios({
        url: coverArt,
        responseType: 'arraybuffer'
      });
      // Generate a thumbnail from the fetched image
      const thumbnailBuffer = await sharp(response.data)
        .resize(200) // Resize to width 200px; height adjusts to maintain aspect ratio
        .toBuffer();
      // Upload the thumbnail to Firebase Storage
      const thumbnailUrl = await uploadToFirebase(thumbnailBuffer, `thumbnails/${Date.now()}_thumbnail.jpg`);
      // Create a new music item in the database
      const music = await Music.create({
        ...otherFields,
        coverArt: coverArt,
        thumbnail: thumbnailUrl
      });

      res.status(200).json(music);

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/music/:id", async (req, res) => {
  const { id } = req.params
  try {
    const music = await Music.findByIdAndUpdate(id, req.body)
    if (!music) {
      return res.status(404).json({ message: "cannot find the song" })
    }
    const updatedMusic = await Music.findById(id)
    res.status(200).json(updatedMusic)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/select", async (req, res) => {
  try {
    const { musicId, position } = req.body
    const selected = await Music.findOneAndUpdate(
      { _id: musicId },
      {
        $set: { selected: true, position: position },
      },
    )
    if (!selected) {
      return res.status(404).json({ message: "cannot find the song" })
    }
    res.status(200).json({ message: "Song selected successfuly" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/unselect", async (req, res) => {
  try {
    const musicId = req.body.musicId
    const unselected = await Music.findOneAndUpdate(
      { _id: musicId },
      {
        $set: { selected: false, position: -1 },
      },
    )
    if (!unselected) {
      return res.status(404).json({ message: "cannot find the song" })
    }
    // const updatedMusic = await Music.findById(id);
    // res.status(200).json(updatedMusic);
    res.status(200).json({ message: "Songs unselected successfuly" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/music/:id", async (req, res) => {
  try {
    const { id } = req.params
    const music = await Music.findByIdAndDelete(id)
    if (!music) {
      return res.status(404).json({ message: "cannot find the song" })
    }
    res.status(200).json({ message: "Song deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
