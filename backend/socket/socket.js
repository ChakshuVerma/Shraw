import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // {userId: socketId}
const joinedConversations = {}; // {userId: [conversationId]}
const activeConversations = {}; // {conversationId: [userId]}

io.on("connection", (socket) => {
  const { userId, conversationId } = socket.handshake.query;
  if (!userId || userId === "undefined" || userId === "null") {
    console.error("Invalid userId:", userId);
    return socket.disconnect(true);
  }

  userSocketMap[userId] = socket.id;

  if (
    conversationId &&
    conversationId !== "undefined" &&
    conversationId !== "null"
  ) {
    if (!joinedConversations[userId]?.includes(conversationId)) {
      socket.join(conversationId);
      activeConversations[conversationId] = activeConversations[conversationId]
        ? [...activeConversations[conversationId], userId]
        : [userId];
      joinedConversations[userId] = joinedConversations[userId]
        ? [...joinedConversations[userId], conversationId]
        : [conversationId];
    }

    io.to(conversationId).emit(
      "getOnlineUsers",
      activeConversations[conversationId]
    );
  }

  // socket.on can be used on both frontend and backend
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    joinedConversations[userId]?.forEach((conversationId) => {
      activeConversations[conversationId] = activeConversations[
        conversationId
      ].filter((id) => id !== userId);
      if (activeConversations[conversationId].length === 0) {
        delete activeConversations[conversationId];
      }
      io.to(conversationId).emit(
        "getOnlineUsers",
        activeConversations[conversationId]
      );
    });
    delete joinedConversations[userId];
  });
});

export { app, io, server };
