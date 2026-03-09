import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import env from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "user_profiles",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `avatar-${Date.now()}`,
      transformation: [{ width: 500, height: 500, crop: "limit" }], // Optimize for mobile
    };
  },
});

export const upload = multer({ storage });
