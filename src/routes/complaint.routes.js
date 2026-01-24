import { Router } from "express";
import {
  submitComplaint,
  getComplaints,
  resolveComplaint,
  getMyWarnings,
  markWarningRead,
  replyToWarning
} from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", verifyJWT, authorizeRoles("donor", "recipient"), submitComplaint);
router.get("/", verifyJWT, authorizeRoles("admin"), getComplaints);
router.get("/mine", verifyJWT, authorizeRoles("donor", "recipient"), getMyWarnings);
router.put(
  "/:complaintId/resolve",
  verifyJWT,
  authorizeRoles("admin"),
  resolveComplaint
);
router.put(
  "/:complaintId/read",
  verifyJWT,
  authorizeRoles("donor", "recipient"),
  markWarningRead
);
router.post(
  "/:complaintId/reply",
  verifyJWT,
  authorizeRoles("donor", "recipient"),
  replyToWarning
);

export default router;
