import { Router } from "express";
import {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  approveRequest,
  rejectRequest
} from "../controllers/request.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/:itemId", verifyJWT, authorizeRoles("donor", "recipient"), createRequest);
router.get("/incoming", verifyJWT, getIncomingRequests);
router.get("/outgoing", verifyJWT, getOutgoingRequests);
router.put("/:requestId/approve", verifyJWT, approveRequest);
router.put("/:requestId/reject", verifyJWT, rejectRequest);

export default router;
