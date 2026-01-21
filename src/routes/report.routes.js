import { Router } from "express";
import {
  getUserReport,
  getItemReport,
  getComplaintReport
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/users", verifyJWT, authorizeRoles("admin"), getUserReport);
router.get("/items", verifyJWT, authorizeRoles("admin"), getItemReport);
router.get("/complaints", verifyJWT, authorizeRoles("admin"), getComplaintReport);

export default router;
