import Message from "../models/message.models.js";
import Conversation from "../models/conversation.models.js";
import { io } from "../socket/socket.js";
import { produceMessage } from "../config/kafka.config.js";
export const sendMessageController = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // This is actually the id of the chatRoom
    const { newCtx } = req.body;
    const senderId = req.user._id;

    produceMessage(senderId, receiverId, newCtx); // This is how you produce a message to Kafka
    io.to(receiverId).emit("newMessage", newCtx); // This is how you emit an event to a specific room (chatRoom in this case)
    res.status(201).json(newCtx);
  } catch (err) {
    console.log("Send message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessageController = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const conversation = await Conversation.findById(userToChatId)
      .populate("currCtx")
      .exec();

    if (!conversation) {
      return res.status(200).json("");
    }

    const currCtx = conversation.currCtx?.message || "";
    res.status(200).json(currCtx);
  } catch (err) {
    console.log("Get message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
