require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
// optional: use url form
app.use(express.urlencoded({ extended: false }))

//routes

app.use("/", require("./routes/routes"))

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
