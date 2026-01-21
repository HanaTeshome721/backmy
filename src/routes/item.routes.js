import { Router } from "express";
import {
  createItem,
  getApprovedItems,
  getItemById,
  updateItem,
  deleteItem,
  approveItem,
  rejectItem
} from "../controllers/item.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", getApprovedItems);
router.get("/:itemId", getItemById);

router.post(
  "/",
  verifyJWT,
  authorizeRoles("donor"),
  createItem
);

router.put(
  "/:itemId",
  verifyJWT,
  authorizeRoles("donor"),
  updateItem
);

router.delete(
  "/:itemId",
  verifyJWT,
  deleteItem
);

router.put(
  "/:itemId/approve",
  verifyJWT,
  authorizeRoles("admin"),
  approveItem
);

router.put(
  "/:itemId/reject",
  verifyJWT,
  authorizeRoles("admin"),
  rejectItem
);

export { router as itemRouter };
export default router;
