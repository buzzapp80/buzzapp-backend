import { Document, Types } from "mongoose";

export interface IProfile {
  user: Types.ObjectId; // Reference to User model
  handle: string;
  avatar_url?: string;
  bio?: string;
  wallet_address?: string;
  reputation: number;
  anonymity_enabled: boolean;
  preferences: Record<string, any>;
}

export type ProfileDocument = IProfile & Document & { id: Types.ObjectId };
