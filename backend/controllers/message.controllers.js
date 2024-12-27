import Message from "../models/message.models.js";
import Conversation from "../models/conversation.models.js";
import { io } from "../socket/socket.js";
import { produceMessage } from "../config/kafka.config.js";

export const sendMessageController = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // This is actually the id of the chatRoom
    const { newStroke } = req.body;
    const senderId = req.user._id;
    const socket = req.socket; // This is how you access the socket in the request
    produceMessage(senderId, receiverId, newStroke); // This is how you produce a message to Kafka
    socket.to(receiverId).emit("newMessage", newStroke); // This is how you emit an event to a specific room (chatRoom in this case)
    res.status(201).json(newStroke);
  } catch (err) {
    console.log("Send message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearMessageController = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    Promise.all([
      Message.deleteMany({ receiverId: receiverId }),
      Conversation.findByIdAndUpdate(receiverId, { $inc: { totalActions: 1 } }),
    ]);
    const socket = req.socket;
    socket.to(receiverId).emit("clearCanvas");
    res.status(200).json("Messages cleared");
  } catch (err) {
    console.log("Clear message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessageController = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const conversation = await Conversation.findById(userToChatId);
    if (!conversation) {
      return res.status(200).json("");
    }

    const messages = await Message.find({ receiverId: userToChatId }).sort({
      createdAt: 1,
    });
    const strokes = messages.map((message) => message.strokeData);

    res.status(200).json(strokes);
  } catch (err) {
    console.log("Get message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
