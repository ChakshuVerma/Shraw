import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    strokeData: {
      color: {
        type: String,
        required: true,
      },
      brushWidth: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      points: [
        {
          x: {
            type: Number,
            required: true,
          },
          y: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true } // timestamps: true will automatically add createdAt and updatedAt fields
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
