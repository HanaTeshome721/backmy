import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },

    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    message: {
      type: String,
      trim: true
    },

    respondedAt: Date
  },
  {
    timestamps: true
  }
);

const Request = mongoose.model("Request", requestSchema);

export { Request };
export default Request;
