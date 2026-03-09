import { Types, Document } from "mongoose";
import type { IVerification } from "./verification.type.js";
import type { IUpvote } from "./upvote.type.js";

export interface ISpot {
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  price: number;
  photo_url: string;
  type: "nugget" | "gem";
  creator_id: Types.ObjectId;
  created_at: Date;
  expires_at?: Date; // mainly for nuggets
  verified: boolean;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  // Virtuals
  verifications?: IVerification[];
  upvotes?: IUpvote[];
  verification_count: number;
  upvote_count: number;
}

export type SpotDocument = ISpot & Document & { _id: Types.ObjectId };
