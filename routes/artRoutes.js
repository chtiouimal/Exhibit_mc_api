const express = require("express")
const sharp = require('sharp');
const axios = require('axios');
const authMiddleware = require("../middleware/authMiddleware")
const uploadToFirebase = require("../services/uploadService");
const Art = require("../models/artModel");
const withModel = require("../middleware/withModel");
const User = require("../models/userModel");

const router = express.Router()

// router.get("/arts/:userId", authMiddleware, async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const arts = await Art.find({ userId: userId });
//     res.status(200).json(arts)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.get("/arts/:userId", authMiddleware, withModel({ Art: Art.schema }), async (req, res) => {
  const userId = req.params.userId;
  try {
    const arts = await req.models.Art.find({ userId: userId });
    res.status(200).json(arts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/art/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params
//     const art = await Art.findById(id)
//     res.status(200).json(art)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.get("/art/:id", authMiddleware, withModel({ Art: Art.schema }), async (req, res) => {
  try {
    const { id } = req.params;
    const art = await req.models.Art.findById(id);
    res.status(200).json(art);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/arts/selected", async (req, res) => {
//   try {
//     const arts = await Art.find({})
//     const selected = arts.filter((e) => e.selected === true)
//     res.status(200).json(selected)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.get("/arts/selected/:id", withModel({ Art: Art.schema }), async (req, res) => {
  const {id} = req.params;
  try {
    const arts = await req.models.Art.find({ userId: id });
    const selected = arts.filter((e) => e.selected === true);
    res.status(200).json(selected);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.post("/art/create", authMiddleware, async (req, res) => {
//   try {
//       const { coverArt, ...otherFields } = req.body;
//             // Fetch the original cover art image from the cloud
//       const response = await axios({
//         url: coverArt,
//         responseType: 'arraybuffer'
//       });
//       // Generate a thumbnail from the fetched image
//       const thumbnailBuffer = await sharp(response.data)
//         .resize(200) // Resize to width 200px; height adjusts to maintain aspect ratio
//         .toBuffer();
//       // Upload the thumbnail to Firebase Storage
//       const thumbnailUrl = await uploadToFirebase(thumbnailBuffer, `thumbnails/${Date.now()}_thumbnail.jpg`);
//       // Create a new music item in the database
//       const art = await Art.create({
//         ...otherFields,
//         coverArt: coverArt,
//         thumbnail: thumbnailUrl
//       });

//       res.status(200).json(art);

//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post("/art/create", withModel({ Art: Art.schema }), async (req, res) => {
//   try {
//       const { coverArt, ...otherFields } = req.body;
//             // Fetch the original cover art image from the cloud
//       const response = await axios({
//         url: coverArt,
//         responseType: 'arraybuffer'
//       });
//       // Generate a thumbnail from the fetched image
//       const thumbnailBuffer = await sharp(response.data)
//         .resize(200) // Resize to width 200px; height adjusts to maintain aspect ratio
//         .toBuffer();
//       // Upload the thumbnail to Firebase Storage
//       const thumbnailUrl = await uploadToFirebase(thumbnailBuffer, `thumbnails/${Date.now()}_thumbnail.jpg`);
//       // Create a new music item in the database
//       const art = await req.models.Art.create({
//         ...otherFields,
//         coverArt: coverArt,
//         thumbnail: thumbnailUrl
//       });

//       res.status(200).json(art);

//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/art/create/:userId", authMiddleware, withModel({ Art: Art.schema, User: User.schema }), async (req, res) => {
  try {
      const { coverArt, ...otherFields } = req.body;
      const { userId } = req.params;
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
      const art = await req.models.Art.create({
        ...otherFields,
        coverArt: coverArt,
        thumbnail: thumbnailUrl,
        userId: userId
      });

      res.status(200).json(art);

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: error.message });
  }
});

// router.put("/art/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params
//     const art = await Art.findByIdAndUpdate(id, req.body)
//     if (!art) {
//       return res.status(404).json({ message: "cannot find the requested art" })
//     }
//     const updatedArt = await Art.findById(id)
//     res.status(200).json(updatedArt)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.put("/art/:id", authMiddleware, withModel({ Art: Art.schema }), async (req, res) => {
  try {
    const { id } = req.params
    const art = await req.models.Art.findByIdAndUpdate(id, req.body)
    if (!art) {
      return res.status(404).json({ message: "cannot find the requested art" })
    }
    const updatedArt = await req.Models.Art.findById(id)
    res.status(200).json(updatedArt)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// router.put("/art/select", authMiddleware, async (req, res) => {
//   try {
//     const { artId, position } = req.body
//     const selected = await Art.findOneAndUpdate(
//       { _id: artId },
//       {
//         $set: { selected: true, position: position },
//       },
//     )
//     if (!selected) {
//       return res.status(404).json({ message: "cannot find the song" })
//     }
//     res.status(200).json({ message: "Song selected successfuly" })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.put("/art/select/:id", authMiddleware, withModel({ Art: Art.schema }), async (req, res) => {
  try {
    const { id } = req.params
    const { position } = req.body
    const selected = await req.models.Art.findOneAndUpdate(
      { _id: id },
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

// router.put("/unselect", authMiddleware, async (req, res) => {
//   try {
//     const artId = req.body.artId
//     const unselected = await Art.findOneAndUpdate(
//       { _id: artId },
//       {
//         $set: { selected: false, position: -1 },
//       },
//     )
//     if (!unselected) {
//       return res.status(404).json({ message: "cannot find the requested art" })
//     }
//     res.status(200).json({ message: "art unselected successfuly" })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.put("/art/unselect/:id", authMiddleware, withModel({ Art: Art.schema }), async (req, res) => {
  try {
    const { id } = req.params
    const unselected = await req.models.Art.findOneAndUpdate(
      { _id: id },
      {
        $set: { selected: false, position: -1 },
      },
    )
    if (!unselected) {
      return res.status(404).json({ message: "cannot find the requested art" })
    }
    res.status(200).json({ message: "art unselected successfuly" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// router.delete("/art/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params
//     const art = await Art.findByIdAndDelete(id)
//     if (!art) {
//       return res.status(404).json({ message: "cannot find the requested art" })
//     }
//     res.status(200).json({ message: "art deleted" })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

router.delete("/art/:id", authMiddleware, withModel({ Art: Art.schema }), async (req, res) => {
  try {
    const { id } = req.params
    const art = await req.models.Art.findByIdAndDelete(id)
    if (!art) {
      return res.status(404).json({ message: "cannot find the requested art" })
    }
    res.status(200).json({ message: "art deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router