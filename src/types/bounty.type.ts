import type { Document, Types } from "mongoose";
import type { IUpvote } from "./upvote.type.js";

export interface IBounty {
  description: string;
  latitude?: number;
  longitude?: number;
  reward_amount: number;
  creator_id: Types.ObjectId;
  type: "public" | "personal";
  status: "open" | "claimed" | "closed";
  created_at: Date;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  // Virtuals
  upvotes?: IUpvote[];
  likes_count: number;
}

export type BountyDocument = IBounty & Document & { _id: Types.ObjectId };
