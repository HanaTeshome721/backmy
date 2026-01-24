import Item from "../models/item.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, condition } = req.body;

  if (!title || !description || !category || !condition) {
    throw new ApiError(400, "Missing required item fields");
  }

  const uploadedImages = Array.isArray(req.files)
    ? req.files.map((file) => ({
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        localPath: file.path
      }))
    : [];

  const item = await Item.create({
    title,
    description,
    category,
    condition,
    images: uploadedImages,
    owner: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, item, "Item created successfully"));
});

const getApprovedItems = asyncHandler(async (req, res) => {
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

  const items = await Item.find(filter)
    .populate("owner", "username email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, items, "Approved items fetched"));
});

const getAllItems = asyncHandler(async (req, res) => {
  const { status, category, owner } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (owner) filter.owner = owner;

  const items = await Item.find(filter)
    .populate("owner", "username email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, items, "Items fetched"));
});

const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ owner: req.user._id })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, items, "My items fetched"));
});

const getItemById = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId).populate(
    "owner",
    "username email role"
  );

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (
    item.status !== "approved" &&
    (!req.user ||
      (req.user.role !== "admin" &&
        item.owner._id.toString() !== req.user._id.toString()))
  ) {
    throw new ApiError(403, "Item is not available");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item fetched"));
});

const updateItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner can update this item");
  }

  const { title, description, category, condition, images } = req.body;

  if (title) item.title = title;
  if (description) item.description = description;
  if (category) item.category = category;
  if (condition) item.condition = condition;
  if (Array.isArray(images)) item.images = images;

  if (item.status === "approved") {
    item.status = "pending";
    item.approvedBy = undefined;
    item.approvedAt = undefined;
  }

  await item.save();

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item updated successfully"));
});

const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (
    item.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this item");
  }

  await Item.findByIdAndDelete(itemId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item deleted successfully"));
});

const approveItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  item.status = "approved";
  item.approvedBy = req.user._id;
  item.approvedAt = new Date();
  await item.save();

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item approved"));
});

const rejectItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  item.status = "rejected";
  item.approvedBy = req.user._id;
  item.approvedAt = new Date();
  await item.save();

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item rejected"));
});

export {
  createItem,
  getApprovedItems,
  getAllItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
  approveItem,
  rejectItem
};
