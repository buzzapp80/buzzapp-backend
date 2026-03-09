import e from "express";
import type { Document, Types } from "mongoose";

export interface IPost {
  author_id: Types.ObjectId; // pseudonym allowed if anonymous
  target_id: Types.ObjectId;
  target_type: "spot" | "hotspot";
  content: string;
  posted_at: Date;
}

export type PostDocument = IPost & Document & { _id: Types.ObjectId };
