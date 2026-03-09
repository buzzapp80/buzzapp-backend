import { Types, model, Schema } from "mongoose";
import type { IClaim } from "../types/claim.type.js";

const ClaimSchema = new Schema<IClaim>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bounty_id: { type: Schema.Types.ObjectId, ref: "Bounty", required: true },
    proof_url: { type: String },
    submitted_at: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

ClaimSchema.set("toObject", { virtuals: true });
ClaimSchema.set("toJSON", { virtuals: true });

export const Claim = model<IClaim>("Claim", ClaimSchema);
