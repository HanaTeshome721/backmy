import { Router } from "express";
import {
  getUsers,
  verifyUser,
  suspendUser,
  deleteUser,
  updateUserRole
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", verifyJWT,  authorizeRoles("admin"), getUsers);
router.put("/:userId/verify", verifyJWT, authorizeRoles("admin"), verifyUser);
router.put("/:userId/suspend", verifyJWT, authorizeRoles("admin"), suspendUser);
router.delete("/:userId", verifyJWT, authorizeRoles("admin"), deleteUser);
router.put("/:userId/role", verifyJWT, authorizeRoles("admin"), updateUserRole);

export default router;
