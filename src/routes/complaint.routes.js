import { Router } from "express";
import {
  submitComplaint,
  getComplaints,
  resolveComplaint
} from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", verifyJWT, authorizeRoles("donor", "recipient"), submitComplaint);
router.get("/", verifyJWT, authorizeRoles("admin"), getComplaints);
router.put(
  "/:complaintId/resolve",
  verifyJWT,
  authorizeRoles("admin"),
  resolveComplaint
);

export default router;
