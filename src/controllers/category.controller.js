import Category from "../models/category.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/app-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const listCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === "true";
  const filter = includeInactive ? {} : { isActive: true };

  const categories = await Category.find(filter).sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched"));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({ name });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, isActive } = req.body;

  const update = {};
  if (name) update.name = name;
  if (isActive !== undefined) update.isActive = isActive;

  const category = await Category.findByIdAndUpdate(categoryId, update, {
    new: true
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isActive: false },
    { new: true }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted"));
});

export { listCategories, createCategory, updateCategory, deleteCategory };
