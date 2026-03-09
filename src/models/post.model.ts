import { Types, model, Schema, Document } from "mongoose";
import type { IPost } from "../types/post.type.js";

const PostSchema = new Schema<IPost>(
  {
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target_id: { type: Schema.Types.ObjectId, required: true },
    target_type: { type: String, enum: ["spot", "hotspot"], required: true },
    content: { type: String, required: true },
    posted_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

export const Post = model<IPost>("Post", PostSchema);
