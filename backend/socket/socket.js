import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redisClient from "../config/redis.config.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
  adapter: createAdapter(redisClient),
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

io.on("connection", (socket) => {
  const { userId, conversationId, name } = socket.handshake.query;

  if (!userId || userId === "undefined" || userId === "null") {
    console.error("Invalid userId:", userId);
    return socket.disconnect(true);
  }

  userSocketMap[userId] = { socketId: socket.id, name };
  if (
    conversationId &&
    conversationId !== "undefined" &&
    conversationId !== "null"
  ) {
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
    io.to(conversationId).emit(
      "getOnlineUsers",
      Object.values(activeConversations[conversationId])
    );
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
    io.emit("getOnlineUsers", Object.values(userSocketMap));
  });
});

export { app, io, server, attachSocketReq };
