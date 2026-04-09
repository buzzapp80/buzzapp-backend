import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import env from "../config/env.js";

/**
 * Generates both Access and Refresh tokens
 * Implements token rotation by updating the database
 */

export const generateTokens = async (
  userId: string,
  role: string,
  isVerified: boolean,
) => {
  const accessToken = jwt.sign(
    {
      id: userId,
      role,
      is_verified: isVerified,
    },
    env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(userId, { refresh_token: refreshToken });

  return { accessToken, refreshToken };
};

/**
 * Authenticates a user and issues new tokens
 */
export const login = async (
  email_or_phone: string,
  password_unhashed: string,
) => {
  // Explicitly select password_hash because it is hidden in the model
  const user = await User.findOne({ email_or_phone }).select("+password_hash");

  if (
    !user ||
    !(await bcrypt.compare(password_unhashed, user.password_hash as string))
  ) {
    throw new Error("Invalid credentials");
  }

  const tokens = await generateTokens(
    user._id.toString(),
    user.role,
    user.is_verified,
  );

  return {
    ...tokens,
    user: {
      id: user._id,
      role: user.role,
    },
  };
};

/**
 * Validates a refresh token and rotates it for a new pair
 */
export const refreshAccessToken = async (oldRefreshToken: string) => {
  try {
    const decoded = jwt.verify(oldRefreshToken, env.JWT_SECRET) as {
      id: string;
    };

    // Check if user exists and if the token matches what we have in DB
    const user = await User.findById(decoded.id).select("+refresh_token");

    if (!user || user.refresh_token !== oldRefreshToken) {
      throw new Error("Invalid or expired refresh token");
    }

    // Return a fresh pair (Rotation)
    return await generateTokens(
      user._id.toString(),
      user.role,
      user.is_verified,
    );
  } catch (error) {
    throw new Error("Session expired. Please login again.");
  }
};

/**
 * Revokes the refresh token by nullifying it in the database.
 * This effectively kills the user's long-lived session.
 */
export const revokeToken = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $set: { refresh_token: null },
  });
};
