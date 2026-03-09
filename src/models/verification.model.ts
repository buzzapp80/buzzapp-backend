import { Schema, model, Types } from "mongoose";
import type { IVerification } from "../types/verification.type.js";

const VerificationSchema = new Schema<IVerification>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    spot_id: { type: Schema.Types.ObjectId, ref: "Spot", required: true },
    proof_url: { type: String },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

VerificationSchema.set("toObject", { virtuals: true });
VerificationSchema.set("toJSON", { virtuals: true });

export const Verification = model<IVerification>(
  "Verification",
  VerificationSchema,
);
