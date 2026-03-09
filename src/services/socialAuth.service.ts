import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import * as authService from "./auth.service.js";
import env from "../config/env.js";
import mongoose from "mongoose";
import { Profile } from "../models/profile.model.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google Token");
  const { sub: google_id, email, name, picture } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user = await User.findOne({
      $or: [{ google_id }, { email_or_phone: email as string }],
    }).session(session);

    if (!user) {
      const [newUser] = await User.create(
        [
          {
            google_id,
            email_or_phone: email as string,
            is_verified: true,
          },
        ],
        { session },
      );

      if (!newUser) {
        throw new Error("New user creation failed");
      }

      user = newUser;

      await Profile.create(
        [
          {
            user: user._id,
            handle: name as string,
            avatar_url: picture as string,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();

    return await authService.generateTokens(
      user._id.toString(),
      user.role,
      true,
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// TODO: Add apple signin option
