import { Schema, model } from "mongoose";
import type { IProfile } from "../types/profile.type.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - user
 *         - handle
 *       properties:
 *         user:
 *           type: string
 *           description: Reference to the User ID.
 *         handle:
 *           type: string
 *           description: Unique social handle (trimmed).
 *         avatar_url:
 *           type: string
 *           format: uri
 *         bio:
 *           type: string
 *           maxLength: 500
 *         wallet_address:
 *           type: string
 *         reputation:
 *           type: number
 *           default: 0
 *         anonymity_enabled:
 *           type: boolean
 *           default: false
 *         preferences:
 *           type: object
 *           description: Dynamic map of user preferences.
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    handle: { type: String, unique: true, required: true, trim: true },
    avatar_url: { type: String },
    bio: { type: String, maxlength: 500 },
    wallet_address: { type: String },
    reputation: { type: Number, default: 0 },
    anonymity_enabled: { type: Boolean, default: false },
    preferences: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const Profile = model<IProfile>("Profile", ProfileSchema);
