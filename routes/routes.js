const express = require("express")
const Music = require("../models/musicModel")
const router = express.Router()

router.get("/musics", async (req, res) => {
  try {
    const musics = await Music.find({})
    res.status(200).json(musics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/musics/selected", async (req, res) => {
  try {
    const musics = await Music.find({})
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
    const music = await Music.create(req.body)
    res.status(200).json(music)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/music/:id", async (req, res) => {
  try {
    const { id } = req.params
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
    const musicId = req.body.musicId
    const selected = await Music.findOneAndUpdate(
      { _id: musicId },
      {
        $set: { selected: true, position: 0 },
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
