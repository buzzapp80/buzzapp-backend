import { Types, model, Schema } from "mongoose";
import type { INotification } from "../types/notification.type.js";

const NotificationSchema = new Schema<INotification>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["hotspot", "bounty", "reward"],
      required: true,
    },
    sent_at: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

NotificationSchema.set("toObject", { virtuals: true });
NotificationSchema.set("toJSON", { virtuals: true });

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema,
);
