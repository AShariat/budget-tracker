const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(compression());
app.use(logger("dev"));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/budget-tracker",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`🌍 App running on port ${PORT}!`);
});
