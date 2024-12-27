import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coverPicture: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    invitations: [
      {
        type: Array,
        default: [],
      },
    ],
    totalActions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
