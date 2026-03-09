import { Schema, model, Types } from "mongoose";
import type { IUser } from "../types/user.type.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email_or_phone
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated virtual ID of the user.
 *         email_or_phone:
 *           type: string
 *           format: email
 *           description: Unique identifier (email or phone number).
 *         role:
 *           type: string
 *           enum: [user, hunter, moderator, admin]
 *           default: user
 *         is_verified:
 *           type: boolean
 *           default: false
 *         google_id:
 *           type: string
 *           nullable: true
 *         apple_id:
 *           type: string
 *           nullable: true
 *         last_login:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const UserSchema = new Schema<IUser>(
  {
    email_or_phone: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password_hash: { type: String, select: false },
    role: {
      type: String,
      enum: ["user", "hunter", "moderator", "admin"],
      default: "user",
    },
    is_verified: { type: Boolean, default: false },
    verification_code: { type: String, select: false },
    verification_expires: { type: Date, select: false },
    refresh_token: { type: String, select: false },
    google_id: { type: String, sparse: true, unique: true },
    apple_id: { type: String, sparse: true, unique: true },
    last_login: { type: Date },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export const User = model<IUser>("User", UserSchema);
