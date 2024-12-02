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
  const { userId, conversationId } = socket.handshake.query;

  // console.log("New connection:", { userId, conversationId });
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
        ? { ...activeConversations[conversationId], userId }
        : { userId };
      joinedConversations[userId] = joinedConversations[userId]
        ? [...joinedConversations[userId], conversationId]
        : [conversationId];
    }
  }

  socket.on("checkRoom", ({ roomId }, callback) => {
    const isInRoom = !!io.sockets.adapter.rooms.get(roomId)?.has(socket.id);
    callback(isInRoom);
  });

  // socket.on can be used on both frontend and backend
  socket.on("disconnect", () => {
    // console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    joinedConversations[userId]?.forEach((conversationId) => {
      delete activeConversations[conversationId][userId];
      if (activeConversations[conversationId].length === 0) {
        delete activeConversations[conversationId];
      }
    });
    delete joinedConversations[userId];
  });
});

export { app, io, server };
