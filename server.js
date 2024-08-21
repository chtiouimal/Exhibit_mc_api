require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config

const app = express()
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))
app.use(express.json())
// optional: use url form
app.use(express.urlencoded({ extended: false }))

//routes

app.use("/", require("./routes/routes"))

app.use("/api", require("./routes/artRoutes"))

app.use("/users", require("./routes/authRoutes"))

// mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("connected to mongoDB")
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
