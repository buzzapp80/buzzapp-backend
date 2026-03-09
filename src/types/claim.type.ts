import type { Document, Types } from "mongoose";

export interface IClaim {
  user_id: Types.ObjectId;
  bounty_id: Types.ObjectId;
  proof_url: string;
  submitted_at: Date;
  status: "pending" | "approved" | "rejected";
}

export type ClaimDocument = IClaim & Document & { _id: Types.ObjectId };
