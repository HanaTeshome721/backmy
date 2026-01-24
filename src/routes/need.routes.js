import { Router } from "express";
import {
  createNeed,
  getApprovedNeeds,
  getNeedById,
  getMyNeeds,
  getAllNeeds,
  approveNeed,
  rejectNeed,
  createOffer,
  getIncomingOffers,
  getOutgoingOffers,
  approveOffer,
  rejectOffer,
  confirmOfferContact
} from "../controllers/need.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/offers/incoming", verifyJWT, getIncomingOffers);
router.get("/offers/outgoing", verifyJWT, getOutgoingOffers);
router.put("/offers/:offerId/approve", verifyJWT, approveOffer);
router.put("/offers/:offerId/reject", verifyJWT, rejectOffer);
router.put("/offers/:offerId/confirm", verifyJWT, confirmOfferContact);

router.get("/", getApprovedNeeds);
router.get("/admin", verifyJWT, authorizeRoles("admin"), getAllNeeds);
router.get("/mine", verifyJWT, authorizeRoles("recipient", "donor"), getMyNeeds);
router.get("/:needId", verifyJWT, getNeedById);

router.post("/", verifyJWT, authorizeRoles("recipient", "donor"), createNeed);
router.put("/:needId/approve", verifyJWT, authorizeRoles("admin"), approveNeed);
router.put("/:needId/reject", verifyJWT, authorizeRoles("admin"), rejectNeed);

router.post("/:needId/offers", verifyJWT, authorizeRoles("donor"), createOffer);

export default router;
