import Need from "../models/need.model.js";
import NeedOffer from "../models/need-offer.model.js";
import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createNeed = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    throw new ApiError(400, "Missing required fields");
  }

  const need = await Need.create({
    title,
    description,
    category,
    requester: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, need, "Request created and pending approval"));
});

const getApprovedNeeds = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = { status: "approved" };

  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const needs = await Need.find(filter)
    .populate("requester", "username email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, needs, "Needs fetched"));
});

const getNeedById = asyncHandler(async (req, res) => {
  const { needId } = req.params;
  const need = await Need.findById(needId).populate(
    "requester",
    "username email role"
  );

  if (!need) {
    throw new ApiError(404, "Request not found");
  }

  if (need.status !== "approved" && req.user.role !== "admin") {
    throw new ApiError(403, "Request is not available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, need, "Request fetched"));
});

const getMyNeeds = asyncHandler(async (req, res) => {
  const needs = await Need.find({ requester: req.user._id }).sort({
    createdAt: -1
  });

  return res
    .status(200)
    .json(new ApiResponse(200, needs, "My requests fetched"));
});

const getAllNeeds = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const needs = await Need.find(filter)
    .populate("requester", "username email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, needs, "Requests fetched"));
});

const approveNeed = asyncHandler(async (req, res) => {
  const { needId } = req.params;
  const need = await Need.findById(needId);

  if (!need) {
    throw new ApiError(404, "Request not found");
  }

  need.status = "approved";
  need.approvedBy = req.user._id;
  need.approvedAt = new Date();
  await need.save();

  return res
    .status(200)
    .json(new ApiResponse(200, need, "Request approved"));
});

const rejectNeed = asyncHandler(async (req, res) => {
  const { needId } = req.params;
  const need = await Need.findById(needId);

  if (!need) {
    throw new ApiError(404, "Request not found");
  }

  need.status = "rejected";
  need.approvedBy = req.user._id;
  need.approvedAt = new Date();
  await need.save();

  return res
    .status(200)
    .json(new ApiResponse(200, need, "Request rejected"));
});

const createOffer = asyncHandler(async (req, res) => {
  const { needId } = req.params;
  const { message } = req.body;

  const need = await Need.findById(needId);
  if (!need) {
    throw new ApiError(404, "Request not found");
  }
  if (need.status !== "approved") {
    throw new ApiError(400, "Request is not available for offers");
  }
  if (need.requester.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot offer your own request");
  }

  const existingOffer = await NeedOffer.findOne({
    need: needId,
    donor: req.user._id,
    status: "pending"
  });
  if (existingOffer) {
    throw new ApiError(409, "You already have a pending offer");
  }

  const offer = await NeedOffer.create({
    need: needId,
    donor: req.user._id,
    requester: need.requester,
    message
  });

  await Notification.create({
    user: need.requester,
    title: "New donation offer",
    message: `A donor offered to help with "${need.title}".`,
    type: "request"
  });

  return res
    .status(201)
    .json(new ApiResponse(201, offer, "Offer submitted"));
});

const getIncomingOffers = asyncHandler(async (req, res) => {
  const offers = await NeedOffer.find({ requester: req.user._id })
    .populate("need")
    .populate("donor", "username email role phoneNumber address fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, offers, "Incoming offers fetched"));
});

const getOutgoingOffers = asyncHandler(async (req, res) => {
  const offers = await NeedOffer.find({ donor: req.user._id })
    .populate("need")
    .populate("requester", "username email role phoneNumber address fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, offers, "Outgoing offers fetched"));
});

const approveOffer = asyncHandler(async (req, res) => {
  const { offerId } = req.params;
  const offer = await NeedOffer.findById(offerId);

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }
  if (
    offer.requester.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Only the requester or admin can approve offers");
  }
  if (offer.status !== "pending") {
    throw new ApiError(400, "Offer is already processed");
  }

  offer.status = "approved";
  offer.respondedAt = new Date();
  await offer.save();

  await Notification.create({
    user: offer.donor,
    title: "Offer approved",
    message: "Your donation offer was approved. The requester will share contact details.",
    type: "request"
  });

  const populated = await NeedOffer.findById(offer._id)
    .populate("need")
    .populate("donor", "username email role phoneNumber address fullName")
    .populate("requester", "username email role phoneNumber address fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Offer approved"));
});

const rejectOffer = asyncHandler(async (req, res) => {
  const { offerId } = req.params;
  const offer = await NeedOffer.findById(offerId);

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }
  if (
    offer.requester.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Only the requester or admin can reject offers");
  }
  if (offer.status !== "pending") {
    throw new ApiError(400, "Offer is already processed");
  }

  offer.status = "rejected";
  offer.respondedAt = new Date();
  await offer.save();

  await Notification.create({
    user: offer.donor,
    title: "Offer rejected",
    message: "Your donation offer was rejected.",
    type: "request"
  });

  const populated = await NeedOffer.findById(offer._id)
    .populate("need")
    .populate("donor", "username email role phoneNumber address fullName")
    .populate("requester", "username email role phoneNumber address fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Offer rejected"));
});

const confirmOfferContact = asyncHandler(async (req, res) => {
  const { offerId } = req.params;
  const offer = await NeedOffer.findById(offerId).populate("need");

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }
  if (
    offer.requester.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Only the requester or admin can confirm");
  }
  if (offer.status !== "approved") {
    throw new ApiError(400, "Offer must be approved first");
  }

  offer.requesterContactSharedAt = new Date();
  await offer.save();

  await Need.findByIdAndUpdate(offer.need._id, { status: "fulfilled" });

  const requester = req.user;
  await Notification.create({
    user: offer.donor,
    title: "Requester contact shared",
    message: `Requester contact: ${requester.fullName || requester.username}, ${requester.phoneNumber || "N/A"}, ${requester.address || "N/A"}`,
    type: "request"
  });

  const populated = await NeedOffer.findById(offer._id)
    .populate("need")
    .populate("donor", "username email role phoneNumber address fullName")
    .populate("requester", "username email role phoneNumber address fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Contact shared"));
});

export {
  createNeed,
  getApprovedNeeds,
  getNeedById,
  getMyNeeds,
  getAllNeeds,
  approveNeed,
  rejectNeed,
  createOffer,
  getIncomingOffers,
  getOutgoingOffers,
  approveOffer,
  rejectOffer,
  confirmOfferContact
};
