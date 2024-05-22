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
const activeConversations = {}; // {conversationId: {userId}}

io.on("connection", (socket) => {
  //   console.log(`A new user connected`);
  const userId = socket.handshake.query.userId;
  const conversationId = socket.handshake.query.conversationId;
  if (userId != "undefined") {
    // If the user is authenticated
    userSocketMap[userId] = socket.id;
    socket.join(conversationId);
    activeConversations[conversationId] = activeConversations[conversationId]
      ? { ...activeConversations[conversationId], userId }
      : { userId };
    joinedConversations[userId] = joinedConversations[userId]
      ? [...joinedConversations[userId], conversationId]
      : [conversationId];
  }

  // socket.on can be used on both frontend and backend
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    joinedConversations[userId]?.forEach((conversationId) => {
      delete activeConversations[conversationId][userId];
      if (activeConversations[conversationId].length === 0) {
        delete activeConversations[conversationId];
      }
    });
    delete joinedConversations[userId];
    // io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
