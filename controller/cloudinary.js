const uploadImage = async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname).slice(1);
    const filePath = req.file.path;

    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: "Image_Uploads",
    });
    const cloudinaryFile = new Cloudinary({
      originalName: req.file.originalname,
      cloudinaryUrl: cloudinaryResponse.secure_url,
      format: cloudinaryResponse.format,
      resource_type: cloudinaryResponse.resource_type,
      asset_folder: Image_Uploads,
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
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
};
