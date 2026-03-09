import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import type { IUser } from "../types/user.type.js";
import type { RegisterUserBody } from "../validations/auth.validation.js";
import { Profile } from "../models/profile.model.js";

/**
 * Handles creation of a new user account
 */
export const registerUser = async (data: RegisterUserBody) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({
      email_or_phone: data.email_or_phone,
    });
    if (existingUser) throw new Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const [newUser] = await User.create(
      [
        {
          email_or_phone: data.email_or_phone,
          password_hash,
          role: "user",
        },
      ],
      { session },
    );

    await Profile.create(
      [
        {
          user: newUser!._id,
          handle: data.handle,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return newUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Updates user preferences or bio
 */
export const updateProfile = async (
  userId: string,
  updateData: Partial<IUser>,
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  );
  if (!user) throw new Error("User not found");
  return user;
};
