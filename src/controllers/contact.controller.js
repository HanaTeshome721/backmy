import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  contactMailgenContent,
  contactReplyMailgenContent,
  sendEmail
} from "../utils/mail.js";
import { User } from "../models/user.models.js";
import ContactMessage from "../models/contact-message.model.js";

const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }
  console.log("ADMIN_CONTACT_EMAIL:", process.env.ADMIN_CONTACT_EMAIL);
  let adminEmail = process.env.ADMIN_CONTACT_EMAIL;
  if (!adminEmail) {
    const adminUser = await User.findOne({ role: "admin" }).select("email");
    adminEmail = adminUser?.email;
  }

  if (!adminEmail) {
    throw new ApiError(500, "Admin contact email is not configured");
  }

  await sendEmail({
    email: adminEmail,
    subject: `Contact form message from ${name}`,
    mailgenContent: contactMailgenContent({ name, email, message })
  });

  await ContactMessage.create({ name, email, message });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message sent to admin"));
});

const listContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Contact messages fetched"));
});

const markContactRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const message = await ContactMessage.findByIdAndUpdate(
    messageId,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw new ApiError(404, "Contact message not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message marked as read"));
});

const replyContactMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { reply } = req.body;

  if (!reply) {
    throw new ApiError(400, "Reply message is required");
  }

  const message = await ContactMessage.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Contact message not found");
  }

  await sendEmail({
    email: message.email,
    subject: "Re: Your contact message",
    mailgenContent: contactReplyMailgenContent({
      name: message.name,
      reply
    })
  });

  message.replyMessage = reply;
  message.repliedAt = new Date();
  message.isRead = true;
  await message.save();

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Reply sent"));
});

export { submitContactMessage, listContactMessages, markContactRead, replyContactMessage };
