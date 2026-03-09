import type { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service.js";

export const handleUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;
    const updatedProfile = await profileService.updateProfile(userId, req.body);

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
    const profile = await profileService.getMyProfile(userId);
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

    const avatar_url = req.file.path;

    const updatedProfile = await profileService.updateProfile(userId, {
      avatar_url,
    });

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: { avatar_url: updatedProfile.avatar_url },
    });
  } catch (error) {
    next(error);
  }
};
