import { Schema, model, Types } from "mongoose";
import type { IBounty } from "../types/bounty.type.js";

const BountySchema = new Schema<IBounty>(
  {
    description: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    reward_amount: { type: Number, required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["public", "personal"], required: true },
    status: {
      type: String,
      enum: ["open", "claimed", "closed"],
      default: "open",
    },
    created_at: { type: Date, default: Date.now },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true },
);

// Virtual populate for likes
BountySchema.virtual("upvotes", {
  ref: "Upvote",
  localField: "_id",
  foreignField: "target_id",
  justOne: false,
  match: { target_type: "bounty" },
});

// Virtual getter for likes_count (require populating 'upvotes' when querying)
BountySchema.virtual("likes_count").get(function (this: IBounty) {
  return this.upvotes?.length || 0;
});

// Index for geospatial queries (optional location)
BountySchema.index({ location: "2dsphere" });

BountySchema.set("toObject", { virtuals: true });
BountySchema.set("toJSON", { virtuals: true });

export const Bounty = model<IBounty>("Bounty", BountySchema);
