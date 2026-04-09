import type { Types } from "mongoose";

export type UserRole = "user" | "hunter" | "moderator" | "admin";

export interface IUser {
  email_or_phone: string;
  password_hash?: string;
  role: UserRole;
  is_verified: boolean;
  verification_code?: string | undefined;
  verification_expires?: Date | undefined;
  refresh_token?: string;
  google_id?: string;
  apple_id?: string;
  last_login?: Date;
  created_at: Date;
}

export type UserDocument = IUser & Document & { _id: Types.ObjectId };
