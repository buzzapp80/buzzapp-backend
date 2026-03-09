import type { Document, Types } from "mongoose";

export interface IPresence {
  user_id?: Types.ObjectId; // optional if anonymous
  hotspot_id: Types.ObjectId;
  checkin_time: Date;
  opted_in_geofence: boolean;
}

export type PresenceDocument = IPresence & Document & { _id: Types.ObjectId };
