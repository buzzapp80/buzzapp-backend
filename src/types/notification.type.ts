import type { Document, Types } from "mongoose";

export interface INotification {
  user_id: Types.ObjectId;
  message: string;
  type: "hotspot" | "bounty" | "reward";
  sent_at: Date;
  read: boolean;
}

export type NotificationDocument = INotification &
  Document & { _id: Types.ObjectId };
