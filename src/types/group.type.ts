import type { Document, Types } from "mongoose";

export interface IGroup {
  name: string;
  manager_id: Types.ObjectId;
  members: Types.ObjectId[]; // array of user_ids
  description: string;
}

export type GroupDocument = IGroup & Document & { _id: Types.ObjectId };
