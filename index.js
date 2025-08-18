require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const connectDB = require("./DB/db_config");
const PORT = process.env.PORT || 5000;
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// connect DB
connectDB();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file.path;

    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "Image_Uploads",
    });

    console.log("response", cloudinaryResponse);
    res.json({ success: true, data: cloudinaryResponse });
  } catch (error) {
    console.log("Upload Error", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
