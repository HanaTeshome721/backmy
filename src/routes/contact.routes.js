import { Router } from "express";
import {
  submitContactMessage,
  listContactMessages,
  markContactRead,
  replyContactMessage
} from "../controllers/contact.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", submitContactMessage);
router.get("/admin", verifyJWT, authorizeRoles("admin"), listContactMessages);
router.put(
  "/admin/:messageId/read",
  verifyJWT,
  authorizeRoles("admin"),
  markContactRead
);
router.post(
  "/admin/:messageId/reply",
  verifyJWT,
  authorizeRoles("admin"),
  replyContactMessage
);

export default router;
