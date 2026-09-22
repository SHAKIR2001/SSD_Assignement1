import { v2 as cloudinary } from "cloudinary";

export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided." });
  }

  // Explicitly configure Cloudinary using environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "kv-audio/images",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "Image upload failed." });
      }

      res.status(200).json({ secure_url: result.secure_url });
    }
  );

  // Pipe the buffer from multer into Cloudinary's upload stream
  uploadStream.end(req.file.buffer);
}
