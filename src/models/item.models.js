import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    condition: {
      type: String,
      enum: ["new", "like_new", "used", "old"],
      required: true
    },

    images: [
      {
        url: String,
        localPath: String
      }
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "exchanged"],
      default: "pending"
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    approvedAt: Date
  },
  {
    timestamps: true
  }
);

const Item = mongoose.model("Item", itemSchema);

export { Item };
export default Item;
