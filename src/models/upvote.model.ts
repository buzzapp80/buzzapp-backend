import { model, Schema, Types } from "mongoose";
import type { IUpvote } from "../types/upvote.type.js";

const UpvoteSchema = new Schema<IUpvote>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target_id: { type: Schema.Types.ObjectId, required: true },
    target_type: { type: String, enum: ["spot", "bounty"], required: true },
    cast_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

UpvoteSchema.set("toObject", { virtuals: true });
UpvoteSchema.set("toJSON", { virtuals: true });

export const Upvote = model<IUpvote>("Upvote", UpvoteSchema);
