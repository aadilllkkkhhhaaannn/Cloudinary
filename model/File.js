const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    resource_type: {
      type: String,
      required: true,
    },
    asset_folder: {
      type: String,
      default: "",
    },
    original_extension: {
      type: String,
      required: true,
    },
    cloud_name: {
      type: String,
      required: true,
    },
    api_key: {
      type: String,
      required: true,
    },
    api_secret: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cloudinary", fileSchema);
