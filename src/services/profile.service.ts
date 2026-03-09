import { Profile } from "../models/profile.model.js";

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
