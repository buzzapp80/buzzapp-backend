import type { Document, Types } from "mongoose";

export interface IUpvote {
  user_id: Types.ObjectId;
  target_id: Types.ObjectId;
  target_type: "spot" | "bounty";
  cast_at: Date;
}

export type UpvoteDocument = IUpvote & Document & { _id: Types.ObjectId };
