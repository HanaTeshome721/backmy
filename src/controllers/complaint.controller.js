import Complaint from "../models/complaint.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { Item } from "../models/item.models.js";
import Notification from "../models/notification.model.js";

const submitComplaint = asyncHandler(async (req, res) => {
  const { againstUser, againstUsername, relatedItem, description } = req.body;

  if (!description) {
    throw new ApiError(400, "Complaint description is required");
  }

  let targetUserId = againstUser;
  let relatedItemId = relatedItem;

  if (!targetUserId && againstUsername) {
    const targetUser = await User.findOne({ username: againstUsername });
    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }
    targetUserId = targetUser._id;
  }

  if (relatedItemId) {
    const item = await Item.findById(relatedItemId);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }
    if (!targetUserId) {
      targetUserId = item.owner;
    }
  }

  const complaint = await Complaint.create({
    complainant: req.user._id,
    againstUser: targetUserId,
    relatedItem: relatedItemId,
    description
  });

  return res
    .status(201)
    .json(new ApiResponse(201, complaint, "Complaint submitted"));
});

const getComplaints = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const complaints = await Complaint.find(filter)
    .populate("complainant", "username email role")
    .populate("againstUser", "username email role")
    .populate("relatedItem")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, complaints, "Complaints fetched"));
});

const getMyWarnings = asyncHandler(async (req, res) => {
  const warnings = await Complaint.find({ againstUser: req.user._id })
    .populate("complainant", "username email role")
    .populate("relatedItem")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, warnings, "Warnings fetched"));
});

const resolveComplaint = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const { adminResponse } = req.body;

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  complaint.status = "resolved";
  complaint.adminResponse = adminResponse || complaint.adminResponse;
  complaint.resolvedBy = req.user._id;
  complaint.resolvedAt = new Date();
  await complaint.save();

  await Notification.create({
    user: complaint.complainant,
    title: "Complaint resolved",
    message: adminResponse || "Your complaint has been resolved.",
    type: "complaint"
  });

  if (complaint.againstUser) {
    await Notification.create({
      user: complaint.againstUser,
      title: "Warning",
      message: `A complaint was filed against you: ${complaint.description}`,
      type: "complaint"
    });

    const complaintCount = await Complaint.countDocuments({
      againstUser: complaint.againstUser
    });

    if (complaintCount >= 3) {
      const suspendedUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      await User.findByIdAndUpdate(complaint.againstUser, {
        isSuspended: true,
        suspendedUntil
      });
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, complaint, "Complaint resolved"));
});

const markWarningRead = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }
  if (complaint.againstUser?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this warning");
  }
  complaint.warningReadAt = new Date();
  await complaint.save();

  return res
    .status(200)
    .json(new ApiResponse(200, complaint, "Warning marked as read"));
});

const replyToWarning = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, "Reply message is required");
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }
  if (complaint.againstUser?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to reply to this warning");
  }

  complaint.userReply = message;
  complaint.userReplyAt = new Date();
  complaint.warningReadAt = new Date();
  await complaint.save();

  const admins = await User.find({ role: "admin" }).select("_id");
  const notifications = admins.map((admin) => ({
    user: admin._id,
    title: "Warning reply received",
    message: `Reply from ${req.user.username}: ${message}`,
    type: "complaint"
  }));
  if (notifications.length) {
    await Notification.insertMany(notifications);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, complaint, "Reply sent to admin"));
});

export {
  submitComplaint,
  getComplaints,
  getMyWarnings,
  resolveComplaint,
  markWarningRead,
  replyToWarning
};
