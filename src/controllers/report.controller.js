import { User } from "../models/user.models.js";
import Item from "../models/item.models.js";
import Complaint from "../models/complaint.model.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getUserReport = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const suspendedUsers = await User.countDocuments({ isSuspended: true });
  const byRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { totalUsers, verifiedUsers, suspendedUsers, byRole }, "User report")
  );
});

const getItemReport = asyncHandler(async (req, res) => {
  const totalItems = await Item.countDocuments();
  const byStatus = await Item.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { totalItems, byStatus }, "Item report"));
});

const getComplaintReport = asyncHandler(async (req, res) => {
  const totalComplaints = await Complaint.countDocuments();
  const byStatus = await Complaint.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { totalComplaints, byStatus }, "Complaint report"));
});

export { getUserReport, getItemReport, getComplaintReport };
