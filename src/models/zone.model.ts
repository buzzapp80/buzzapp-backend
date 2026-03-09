import { Schema, model, Types } from "mongoose";
import type { IZone } from "../types/zone.type.js";

const ZoneSchema = new Schema<IZone>(
  {
    polygon: {
      type: { type: String, enum: ["Polygon"], required: true },
      coordinates: { type: [[[Number]]], required: true },
    },
    moderator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rotation_date: { type: Date },
    incentive_points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Index for geospatial queries
ZoneSchema.index({ polygon: "2dsphere" });

ZoneSchema.set("toObject", { virtuals: true });
ZoneSchema.set("toJSON", { virtuals: true });

export const Zone = model<IZone>("Zone", ZoneSchema);
