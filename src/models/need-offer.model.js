import mongoose, { Schema } from "mongoose";

const needOfferSchema = new Schema(
  {
    need: {
      type: Schema.Types.ObjectId,
      ref: "Need",
      required: true
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requester: {
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
    respondedAt: Date,
    requesterContactSharedAt: Date
  },
  {
    timestamps: true
  }
);

const NeedOffer = mongoose.model("NeedOffer", needOfferSchema);

export { NeedOffer };
export default NeedOffer;
