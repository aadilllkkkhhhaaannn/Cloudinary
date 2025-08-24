require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const connectDB = require("./DB/db_config");
const PORT = process.env.PORT || 5000;
const { v2: cloudinary } = require("cloudinary");
const Cloudinary = require("./model/File");

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
  res.render("index", { url: null });
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
    const ext = path.extname(req.file.originalname).slice(1);
    const filePath = req.file.path;

    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: "Image_Uploads",
    });
    const cloudinaryFile = new Cloudinary({
      originalName: req?.file?.originalname,
      cloudinaryUrl: cloudinaryResponse?.secure_url,
      format: cloudinaryResponse?.format,
      resource_type: cloudinaryResponse?.resource_type,
      asset_folder: "Image_Uploads",
      cloud_name: process?.env?.CLOUD_NAME,
      api_key: process?.env?.API_KEY,
      api_secret: process?.env?.API_SECRET,
      original_extension: path.extname(req.file.originalname).slice(1),
      public_id: cloudinaryResponse.public_id,
    });

    await cloudinaryFile.save();

    // Render the uploaded URL
    res.render("index", { url: cloudinaryResponse.secure_url });
  } catch (error) {
    console.log("Upload Error", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
