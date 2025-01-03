import Conversation from "../models/conversation.models.js";
import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import {
  sendMail,
  addMembersEmail,
  conversationDeletionInfoEmail,
} from "../utils/sendMail.js";

export const checkConversationMembershipController = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;
    const conversation = await Conversation.findById({ _id: conversationId });

    if (!conversation) {
      res.status(401).json({
        error: "Conversation not found",
      });
    } else if (!conversation.members.includes(userId)) {
      res
        .status(404)
        .json({ error: "The user is not a part of this conversation" });
    } else {
      res.status(200).json({ message: "Authority Confirmed!", conversation });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createConversationController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const adminId = req.user._id;

    const coverPicture =
      "https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg";
    const newConversation = new Conversation({
      name,
      description,
      members: [adminId],
      admin: adminId,
      invitations: [],
      coverPicture,
    });

    if (newConversation) {
      const conversation = await Conversation.findOne({
        name,
      });

      if (conversation) {
        res.status(400).json({
          error: "You already have a conversation with this name",
        });
      } else {
        await newConversation.save();
        res.status(200).json({ message: "Chat room created successfully" });
      }
    } else {
      res.status(500).json({ error: "Conversation creation failed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteConversationController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.body;

    const conversation = await Conversation.findById({
      _id: conversationId,
    }).populate("members");
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
    } else {
      if (conversation.admin.toString() !== userId.toString()) {
        res.status(401).json({
          error: "You are not authorized to delete this conversation",
        });
      } else {
        const adminName = req.user.name;
        const conversationMembers = conversation.members;
        const emailPromises = conversationMembers.map((member) => {
          // Step 1: Create a promise for each member
          const { email: memberEmail, name: receiverName } = member;
          const { subject, htmlBody } = conversationDeletionInfoEmail(
            receiverName,
            conversation.name,
            adminName
          );
          // `sendMail` is called here, returning a promise
          return sendMail(memberEmail, subject, htmlBody);
        });

        await Promise.all([
          ...emailPromises,
          Conversation.deleteOne({ _id: conversationId }),
          Message.deleteMany({ receiverId: conversationId }),
        ]);
        res.status(200).json({ message: "Conversation deleted successfully" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const leaveConversationController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.body;

    const user = await User.findById(userId);
    let conversation = await Conversation.findById({ _id: conversationId });

    if (!user || !conversation) {
      res.status(401).json({
        error:
          "Either the user does not exists or / and the conversation does not exists",
      });
    } else if (!conversation.members.includes(userId)) {
      res
        .status(404)
        .json({ error: "The user is not a part of this conversation" });
    } else {
      conversation.members = conversation.members.filter((member) => {
        return (
          JSON.parse(JSON.stringify(member)) !==
          JSON.parse(JSON.stringify(userId))
        );
      });
      await conversation.save();
      res.status(200).json({ message: "You have left the conversation" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinConversationController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { url } = req.body;
    const { id: conversationId } = req.params;
    let conversation = await Conversation.findById({ _id: conversationId });
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else if (!user.isVerified) {
      res.status(401).json({ error: "User is not verified" });
    } else if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
    } else if (conversation.members.includes(userId)) {
      res.status(200).json({ message: "You are already in the conversation" });
    } else {
      let found = false;
      for (let i = 0; i < conversation.invitations.length; i++) {
        if (
          conversation.invitations[i][1] === url &&
          JSON.parse(JSON.stringify(conversation.invitations[i][0])) ===
            JSON.parse(JSON.stringify(userId))
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        res.status(401).json({ error: "Invalid invitation link" });
      } else {
        conversation.members.push(userId);
        conversation.invitations = conversation.invitations.filter((conv) => {
          return (
            JSON.parse(JSON.stringify(conv[0])) !==
            JSON.parse(JSON.stringify(userId))
          );
        });
        await conversation.save();

        res.status(200).json({
          message: `Congratulations, You have joined ${conversation.name}`,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMembersController = async (req, res) => {
  try {
    const { memberEmail } = req.body;
    const { id: conversationId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findById({ _id: conversationId });
    const sender = await User.findById(senderId);

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
    } else if (!sender) {
      res.status(404).json({ error: "Sender not found" });
    } else if (
      JSON.parse(JSON.stringify(conversation.admin)) !==
      JSON.parse(JSON.stringify(sender._id))
    ) {
      res.status(401).json({
        error: "You are not authorized to add members to this conversation",
      });
    } else {
      const member = await User.findOne({ email: memberEmail });

      if (!member || !member.isVerified) {
        res.status(404).json({ error: "Email is not registered on Shraw" });
      } else if (conversation.members.includes(member._id)) {
        res
          .status(200)
          .json({ error: "Member is already in the conversation" });
      } else {
        const { htmlBody, subject, url } = addMembersEmail(
          member._id,
          member.name,
          conversationId,
          conversation.name,
          sender.name
        );

        const result = await sendMail(memberEmail, subject, htmlBody);

        if (result) {
          let found = false;
          for (let i = 0; i < conversation.invitations.length; i++) {
            if (
              JSON.parse(JSON.stringify(conversation.invitations[i][0])) ===
              JSON.parse(JSON.stringify(member._id))
            ) {
              conversation.invitations[i][1] = url;
              found = true;
              break;
            }
          }
          if (!found) conversation.invitations.push([member._id, url]);
          await conversation.save();
          res.status(200).json({ message: "Invitation sent succesfully" });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  } catch (err) {
    console.log("Error while adding members", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const userId = loggedInUserId.toString();

    const joinedConversations = await Conversation.find({
      members: { $all: [loggedInUserId] },
    }).populate({
      path: "admin", // Populate the admin field
      select: "username profilePic", // Fetch the username and profile pic of the admin
    });
    let allConversations = JSON.parse(JSON.stringify(joinedConversations));
    if (!allConversations) {
      return res.status(404).json({ error: "No conversations found" });
    }
    allConversations = allConversations.map((conversation) => {
      return {
        ...conversation,
        isAdmin: conversation.admin._id.toString() === userId, // Check if the logged-in user is the admin
      };
    });
    res.status(200).json(allConversations);
  } catch (err) {
    console.log("Get all chats error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
