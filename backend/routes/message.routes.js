import express from "express";
const router = express.Router();
import {
  getMessageController,
  sendMessageController,
} from "../controllers/message.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

router.get("/:id", protectRoute, getMessageController);
router.post("/send/:id", protectRoute, sendMessageController);

export default router;
