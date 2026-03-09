import type { Request, Response, NextFunction } from "express";
import {
  getMyProfile,
  updateAvatar,
  updateProfile,
} from "../services/profile.service.js";

export const handleUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;
    const updatedProfile = await updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;
    const profile = await getMyProfile(userId);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const handleAvatarUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { path: avatar_url, filename: avatar_public_id } = req.file;

    const updatedProfile = await updateAvatar(
      userId,
      avatar_url,
      avatar_public_id,
    );

    if (!updatedProfile) {
      throw new Error("Avatar upload failed");
    }

    res.status(200).json({
      success: true,
      message: "Avatar updated",
      data: { avatar_url: updatedProfile.avatar_url },
    });
  } catch (error) {
    next(error);
  }
};
