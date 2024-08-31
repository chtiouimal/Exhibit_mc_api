require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const setDatabase = require("./middleware/setDatabase")
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

// DB creation
const devDBConnection = mongoose.createConnection(process.env.DB_DEV_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const prodDBConnection = mongoose.createConnection(process.env.DB_PROD_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//routes

app.use("/", setDatabase(devDBConnection), require("./routes/routes"))

app.use("/api", setDatabase(prodDBConnection), require("./routes/artRoutes"))

app.use("/users", setDatabase(prodDBConnection), require("./routes/authRoutes"))

// Start server after connecting to databases
Promise.all([devDBConnection, prodDBConnection])
  .then(() => {
    console.log("Connected to both databases");
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to databases", err);
  });
