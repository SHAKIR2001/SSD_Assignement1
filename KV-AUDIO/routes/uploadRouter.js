import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";

const uploadRouter = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();

// File filter for images (JPG, JPEG, PNG, WebP)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, PNG and WebP are allowed."), false);
  }
};

// Multer upload instance with 5MB file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilter,
});

// The upload route
uploadRouter.post("/", upload.single("image"), uploadImage);

// Error handling middleware for Multer errors
uploadRouter.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds the 5MB limit." });
    }
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

export default uploadRouter;
