import type { Types, Document } from "mongoose";
import type { IPresence } from "./presence.type.js";

export interface IHotspot {
  latitude: number;
  longitude: number;
  description: string;
  creator_id: Types.ObjectId;
  created_at: Date;
  recurrence_pattern?: string; // e.g., weekly
  duration_minutes: number;
  last_presence_time: Date;
  active: boolean;
  group_id?: Types.ObjectId; // optional - for recurring groups
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  // Virtuals
  presences?: IPresence[];
  headcount: number;
}

export type HotspotDocument = IHotspot & Document & { _id: Types.ObjectId };
