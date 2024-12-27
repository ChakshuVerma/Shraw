import express from "express";
const router = express.Router();
import {
  getMessageController,
  sendMessageController,
  clearMessageController,
} from "../controllers/message.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

router.get("/:id", protectRoute, getMessageController);
router.post("/send/:id", protectRoute, sendMessageController);
router.delete("/clear/:id", protectRoute, clearMessageController);

export default router;
