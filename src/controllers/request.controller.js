import Request from "../models/request.model.js";
import Item from "../models/item.models.js";
import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createRequest = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { message } = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }
  if (item.status !== "approved") {
    throw new ApiError(400, "Item is not available for requests");
  }
  if (item.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot request your own item");
  }
  if (!req.user.isVerified) {
    throw new ApiError(403, "Account must be verified to request items");
  }

  const existingRequest = await Request.findOne({
    item: itemId,
    requester: req.user._id,
    status: "pending"
  });
  if (existingRequest) {
    throw new ApiError(409, "You already have a pending request");
  }

  const request = await Request.create({
    item: itemId,
    requester: req.user._id,
    owner: item.owner,
    message
  });

  await Notification.create({
    user: item.owner,
    title: "New item request",
    message: `You received a new request for ${item.title}`,
    type: "request"
  });

  return res
    .status(201)
    .json(new ApiResponse(201, request, "Request created"));
});

const getIncomingRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ owner: req.user._id })
    .populate("item")
    .populate("requester", "username email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Incoming requests fetched"));
});

const getOutgoingRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ requester: req.user._id })
    .populate("item")
    .populate("owner", "username email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Outgoing requests fetched"));
});

const approveRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }
  if (request.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the item owner can approve requests");
  }
  if (request.status !== "pending") {
    throw new ApiError(400, "Request is already processed");
  }

  request.status = "approved";
  request.respondedAt = new Date();
  await request.save();

  await Item.findByIdAndUpdate(request.item, { status: "exchanged" });

  await Notification.create({
    user: request.requester,
    title: "Request approved",
    message: "Your request has been approved",
    type: "request"
  });

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Request approved"));
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }
  if (request.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the item owner can reject requests");
  }
  if (request.status !== "pending") {
    throw new ApiError(400, "Request is already processed");
  }

  request.status = "rejected";
  request.respondedAt = new Date();
  await request.save();

  await Notification.create({
    user: request.requester,
    title: "Request rejected",
    message: "Your request has been rejected",
    type: "request"
  });

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Request rejected"));
});

export {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  approveRequest,
  rejectRequest
};
