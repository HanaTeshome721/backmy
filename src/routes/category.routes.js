import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", listCategories);
router.post("/", verifyJWT, authorizeRoles("admin"), createCategory);
router.put("/:categoryId", verifyJWT, authorizeRoles("admin"), updateCategory);
router.delete(
  "/:categoryId",
  verifyJWT,
  authorizeRoles("admin"),
  deleteCategory
);

export default router;
