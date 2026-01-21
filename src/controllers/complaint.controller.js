import Complaint from "../models/complaint.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const submitComplaint = asyncHandler(async (req, res) => {
  const { againstUser, relatedItem, description } = req.body;

  if (!description) {
    throw new ApiError(400, "Complaint description is required");
  }

  const complaint = await Complaint.create({
    complainant: req.user._id,
    againstUser,
    relatedItem,
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

  return res
    .status(200)
    .json(new ApiResponse(200, complaint, "Complaint resolved"));
});

export { submitComplaint, getComplaints, resolveComplaint };
