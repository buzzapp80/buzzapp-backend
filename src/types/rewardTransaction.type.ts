import type { Types, Document } from "mongoose";

export interface IRewardTransaction {
  user_id: Types.ObjectId;
  amount: number;
  reason: string; // e.g., verification, airdrop
  tx_hash: string; // blockchain reference
  transacted_at: Date;
}

export type RewardTransactionDocument = IRewardTransaction &
  Document & { _id: Types.ObjectId };
