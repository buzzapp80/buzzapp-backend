import type { Document, Types } from "mongoose";

export interface IZone {
  polygon: {
    type: "Polygon";
    coordinates: number[][][]; // [[[lng, lat], ...]]
  };
  moderator_id: Types.ObjectId;
  rotation_date: Date;
  incentive_points: number;
}

export type ZoneDocument = IZone & Document & { _id: Types.ObjectId };
