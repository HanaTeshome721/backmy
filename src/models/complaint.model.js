import mongoose, { Schema } from "mongoose";

const complaintSchema = new Schema(
  {
    complainant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    againstUser: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    relatedItem: {
      type: Schema.Types.ObjectId,
      ref: "Item"
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open"
    },

    adminResponse: {
      type: String,
      trim: true
    },
    userReply: {
      type: String,
      trim: true
    },
    userReplyAt: Date,
    warningReadAt: Date,

    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    resolvedAt: Date
  },
  {
    timestamps: true
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export { Complaint };
export default Complaint;
