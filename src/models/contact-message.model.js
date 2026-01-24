import mongoose, { Schema } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    replyMessage: {
      type: String,
      trim: true
    },
    repliedAt: Date
  },
  {
    timestamps: true
  }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export { ContactMessage };
export default ContactMessage;
