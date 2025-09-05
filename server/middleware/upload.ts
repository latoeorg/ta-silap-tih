import multer from "multer";
import path from "path";
import { Request } from "express";

// Configure storage for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures/");
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and user ID
    const userId = req.user?.userId || "unknown";
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `profile-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter for profile pictures (only images)
const profilePictureFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for profile pictures"));
  }
};

// Multer configuration for profile pictures
export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: profilePictureFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Export the middleware function
export const profilePictureUpload =
  uploadProfilePicture.single("profilePicture");
