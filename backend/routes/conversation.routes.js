import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getAllConversations,
  addMembersController,
  joinConversationController,
  createConversationController,
  leaveConversationController,
  checkConversationMembershipController,
  deleteConversationController,
} from "../controllers/conversation.controllers.js";
const router = express.Router();

router.get("/", protectRoute, getAllConversations);
router.post("/add/:id", protectRoute, addMembersController);
router.post("/join/:id", protectRoute, joinConversationController);
router.post("/create", protectRoute, createConversationController);
router.post("/leave", protectRoute, leaveConversationController);
router.post("/check", protectRoute, checkConversationMembershipController);
router.post("/delete", protectRoute, deleteConversationController);

export default router;
