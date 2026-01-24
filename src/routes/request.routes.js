import { Router } from "express";
import {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  confirmExchange
} from "../controllers/request.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/:itemId",
  verifyJWT,
  authorizeRoles("donor", "recipient"),
  upload.array("evidenceImages", 6),
  createRequest
);
router.get("/incoming", verifyJWT, getIncomingRequests);
router.get("/outgoing", verifyJWT, getOutgoingRequests);
router.get("/admin", verifyJWT, authorizeRoles("admin"), getAllRequests);
router.put("/:requestId/approve", verifyJWT, approveRequest);
router.put("/:requestId/reject", verifyJWT, rejectRequest);
router.put("/:requestId/confirm", verifyJWT, confirmExchange);

export default router;
