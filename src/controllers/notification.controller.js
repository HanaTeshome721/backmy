import Notification from "../models/notification.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    throw new ApiError(400, "Title and message are required");
  }

  const users = await User.find({}, "_id");
  const payload = users.map((user) => ({
    user: user._id,
    title,
    message,
    type: "system"
  }));

  await Notification.insertMany(payload);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Announcement sent"));
});

export { getMyNotifications, markNotificationRead, createAnnouncement };
