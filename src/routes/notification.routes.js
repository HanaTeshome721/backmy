import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
  createAnnouncement
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", verifyJWT, getMyNotifications);
router.put("/:notificationId/read", verifyJWT, markNotificationRead);
router.post(
  "/announcement",
  verifyJWT,
  authorizeRoles("admin"),
  createAnnouncement
);

export default router;
