import { Profile } from "../models/profile.model.js";
import { v2 as cloudinary } from "cloudinary";

export const updateProfile = async (userId: string, updateData: any) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updateData },
    { returnDocument: "after", runValidators: true },
  );

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

export const getMyProfile = async (userId: string) => {
  return await Profile.findOne({ user: userId }).populate("user");
};

export const updateAvatar = async (
  userId: string,
  newUrl: string,
  newPublicId: string,
) => {
  const profile = await Profile.findOne({ user: userId });

  if (profile && profile.avatar_public_id) {
    await cloudinary.uploader.destroy(profile.avatar_public_id);
  }

  return await Profile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        avatar_url: newUrl,
        avatar_public_id: newPublicId,
      },
    },
    { new: true },
  );
};
