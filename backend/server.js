//! module imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//! file imports
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectToMongoDB from "./db/connect.db.js";
import conversationRoutes from "./routes/conversation.routes.js";
import { app, server } from "./socket/socket.js ";

const PORT = process.env.PORT || 5000;

dotenv.config(); // Load env variables
app.use(express.json()); // To extract from req.body
app.use(cookieParser()); // To parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// Start the server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
