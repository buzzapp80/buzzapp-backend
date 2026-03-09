import { Types, model, Schema } from "mongoose";
import type { IGroup } from "../types/group.type.js";

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    manager_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    description: { type: String },
  },
  { timestamps: true },
);

GroupSchema.set("toObject", { virtuals: true });
GroupSchema.set("toJSON", { virtuals: true });

export const Group = model<IGroup>("Group", GroupSchema);
