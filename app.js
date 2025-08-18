const express = require("express");
const app = express();

app.get("/cloudinary-api", (req, res) => {
  res.json({
    msg: "API is running...",
  });
});

module.exports = app;
