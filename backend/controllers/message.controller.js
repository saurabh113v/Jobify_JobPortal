import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // From isAuthenticated middleware
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                message: "Message content is required.",
                success: false
            });
        }

        // 1. Create and save the new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        // 2. Find or create conversation between these two participants
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Update last message pointer
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        // 3. Emit real-time message via socket if the receiver is online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            message: "Message sent successfully.",
            success: true,
            newMessage
        });

    } catch (error) {
        console.error("SendMessage Error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
};

// Get message history between logged-in user and another user
export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        // Fetch messages where sender/receiver are these two users
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        // Auto-mark received messages as read
        await Message.updateMany(
            { senderId: receiverId, receiverId: senderId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("GetMessages Error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
};

// Get list of active chats/conversations for the logged-in user
export const getConversations = async (req, res) => {
    try {
        const userId = req.id;

        // Find all conversations where the logged-in user is a participant
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })
        .populate({
            path: "participants",
            select: "fullname email role profile"
        })
        .populate({
            path: "lastMessage",
            select: "message senderId receiverId isRead createdAt"
        })
        .sort({ updatedAt: -1 });

        // Format for easy frontend rendering (expose otherUser directly)
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.participants.find(
                participant => participant._id.toString() !== userId.toString()
            );
            return {
                _id: conv._id,
                otherUser,
                lastMessage: conv.lastMessage,
                updatedAt: conv.updatedAt
            };
        }).filter(conv => conv.otherUser !== undefined); // Safety filter

        return res.status(200).json({
            success: true,
            conversations: formattedConversations
        });

    } catch (error) {
        console.error("GetConversations Error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
};
