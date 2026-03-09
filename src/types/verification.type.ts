import type { Document, Types } from "mongoose";

export interface IVerification {
  user_id: Types.ObjectId;
  spot_id: Types.ObjectId;
  proof_url: string; // e.g., photo
  submitted_at: Date;
}

export type VerificationDocument = IVerification &
  Document & { _id: Types.ObjectId };
