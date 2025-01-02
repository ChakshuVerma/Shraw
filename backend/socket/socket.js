import { Server } from "socket.io";
import http from "http";
import express from "express";
import { redisSubClient } from "../config/redis.config.js";
import { webSocketChannels } from "../constants/constants.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

redisSubClient.subscribe(process.env.REDIS_CHANNEL);

// Listen for incoming messages from Redis
redisSubClient.on("message", (channel, message) => {
  if (channel === process.env.REDIS_CHANNEL) {
    // Parse the message if it's JSON formatted
    const data = JSON.parse(message);
    // Broadcast the message to relevant clients using socket.io
    if (data?.receiverId) {
      const channelName = data.webSocketChannel;
      const chatId = data.receiverId;
      delete data.webSocketChannel;
      delete data.receiverId;
      delete data.senderId;
      io.to(chatId).emit(channelName, data);
    }
  }
});

const userSocketMap = {}; // {userId: {socketId, name}}
const joinedConversations = {}; // {userId: [conversationId]}
const activeConversations = {}; // {conversationId: [{userId, name, socketId}]}

const attachSocketReq = (req, _, next) => {
  const socket = userSocketMap[req.user._id].socketId;
  if (socket) {
    req.socket = io.sockets.sockets.get(socket);
  }
  next();
};

io.on(webSocketChannels.connection, (socket) => {
  const { userId, conversationId, name } = socket.handshake.query;

  if (!userId || userId === "undefined" || userId === "null") {
    console.error("Invalid userId:", userId);
    return socket.disconnect(true);
  }

  userSocketMap[userId] = { socketId: socket.id, name };

  if (conversationId) {
    if (!joinedConversations[userId]?.includes(conversationId)) {
      socket.join(conversationId);
      activeConversations[conversationId] = activeConversations[conversationId]
        ? {
            ...activeConversations[conversationId],
            [userId]: { userId, name, socketId: socket.id },
          }
        : { [userId]: { userId, name, socketId: socket.id } };
      joinedConversations[userId] = joinedConversations[userId]
        ? [...joinedConversations[userId], conversationId]
        : [conversationId];
    }

    // Emit the online users list immediately after user joins the room
    io.to(conversationId).emit(
      webSocketChannels.getOnlineUsers,
      Object.values(activeConversations[conversationId])
    );
  }

  // socket.on can be used on both frontend and backend
  socket.on(webSocketChannels.disconnect, () => {
    delete userSocketMap[userId];
    joinedConversations[userId]?.forEach((conversationId) => {
      delete activeConversations[conversationId][userId];
      if (activeConversations[conversationId].length === 0) {
        delete activeConversations[conversationId];
      }
    });
    delete joinedConversations[userId];
    io.to(conversationId).emit(
      webSocketChannels.getOnlineUsers,
      Object.values(activeConversations[conversationId])
    );
  });
});

export { app, io, server, attachSocketReq };
