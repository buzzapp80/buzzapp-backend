import { Schema, model, Types } from "mongoose";
import type { IHotspot } from "../types/hotspot.type.js";

const HotspotSchema = new Schema<IHotspot>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String, required: true },
    creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
    recurrence_pattern: { type: String },
    duration_minutes: { type: Number, default: 30 },
    last_presence_time: { type: Date },
    active: { type: Boolean, default: true },
    group_id: { type: Schema.Types.ObjectId, ref: "Group" },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true },
);

// Virtual populate for derived headcount
HotspotSchema.virtual("presences", {
  ref: "Presence",
  localField: "_id",
  foreignField: "hotspot_id",
  justOne: false,
});

// Virtual getter for headcount (require populating 'presences' when querying; in practice, filter active presences in app logic)
HotspotSchema.virtual("headcount").get(function (this: IHotspot) {
  return this.presences?.length || 0;
});

// Index for geospatial queries
HotspotSchema.index({ location: "2dsphere" });

HotspotSchema.set("toObject", { virtuals: true });
HotspotSchema.set("toJSON", { virtuals: true });

export const Hotspot = model<IHotspot>("Hotspot", HotspotSchema);
