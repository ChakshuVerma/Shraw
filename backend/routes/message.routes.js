import express from "express";
const router = express.Router();
import {
  getMessageController,
  sendMessageController,
  clearMessageController,
} from "../controllers/message.controllers.js";
import protectRoute from "../middleware/protectRoute.js";
import { attachSocketReq } from "../socket/socket.js";

router.get("/:id", protectRoute, getMessageController);
router.post("/send/:id", protectRoute, attachSocketReq, sendMessageController);
router.delete(
  "/clear/:id",
  protectRoute,
  attachSocketReq,
  clearMessageController
);

export default router;
