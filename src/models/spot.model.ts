import { Schema, model, Types } from "mongoose";
import type { ISpot } from "../types/spot.type.js";

const SpotSchema = new Schema<ISpot>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    photo_url: { type: String },
    type: { type: String, enum: ["nugget", "gem"], required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date },
    verified: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true },
);

// Virtual populates for derived fields
SpotSchema.virtual("verifications", {
  ref: "Verification",
  localField: "_id",
  foreignField: "spot_id",
  justOne: false,
});

SpotSchema.virtual("upvotes", {
  ref: "Upvote",
  localField: "_id",
  foreignField: "target_id",
  justOne: false,
  match: { target_type: "spot" },
});

// Virtual getters for counts (require populating 'verifications' and 'upvotes' when querying)
SpotSchema.virtual("verification_count").get(function (this: ISpot) {
  return this.verifications?.length || 0;
});

SpotSchema.virtual("upvote_count").get(function (this: ISpot) {
  return this.upvotes?.length || 0;
});

// Index for geospatial queries
SpotSchema.index({ location: "2dsphere" });

SpotSchema.set("toObject", { virtuals: true });
SpotSchema.set("toJSON", { virtuals: true });

export const Spot = model<ISpot>("Spot", SpotSchema);
