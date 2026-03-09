import { Types, model, Schema } from "mongoose";
import type { IRewardTransaction } from "../types/rewardTransaction.type.js";

const RewardTransactionSchema = new Schema<IRewardTransaction>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    reason: { type: String },
    tx_hash: { type: String },
    transacted_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

RewardTransactionSchema.set("toObject", { virtuals: true });
RewardTransactionSchema.set("toJSON", { virtuals: true });

export const RewardTransaction = model<IRewardTransaction>(
  "RewardTransaction",
  RewardTransactionSchema,
);
