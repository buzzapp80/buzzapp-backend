import { model, Schema, Document, Types } from "mongoose";
import type { IPresence } from "../types/presence.type.js";

const PresenceSchema = new Schema<IPresence>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    hotspot_id: { type: Schema.Types.ObjectId, ref: "Hotspot", required: true },
    checkin_time: { type: Date, default: Date.now },
    opted_in_geofence: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PresenceSchema.set("toObject", { virtuals: true });
PresenceSchema.set("toJSON", { virtuals: true });

export const Presence = model<IPresence>("Presence", PresenceSchema);
