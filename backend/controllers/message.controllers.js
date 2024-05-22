import Message from "../models/message.models.js";
import Conversation from "../models/conversation.models.js";
import { io } from "../socket/socket.js";
export const sendMessageController = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // This is actually the id of the chatRoom
    const { newCtx } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findById({ _id: receiverId });
    const newMessage = new Message({
      senderId,
      receiverId,
      message: newCtx,
    });

    if (newMessage) {
      conversation.currCtx = newCtx;
    }

    await Promise.all([conversation.save(), newMessage.save()]); // This is a better way to save multiple documents in parallel
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
    const senderId = req.user._id;
    const conversation = await Conversation.findById(userToChatId).populate(
      "currCtx"
    );

    if (!conversation) {
      return res.status(200).json("");
    }

    const currCtx = conversation.currCtx;
    res.status(200).json(currCtx);
  } catch (err) {
    console.log("Get message error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
