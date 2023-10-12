const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const winston = require("winston");
const userRoutes = require("./routes/userRoutes");
const database = require("./config/database");
const logger = require("./logger");
const cors = require("cors"); 

database(logger);

// parse incoming request bodies
app.use(bodyParser.json());

app.use(cors());

// routes
app.use("/api", userRoutes);

app.use((err, req, res, next) => {
  logger.error("An error occurred:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(5000, () => {
  logger.info("Server started on port 5000");
});
