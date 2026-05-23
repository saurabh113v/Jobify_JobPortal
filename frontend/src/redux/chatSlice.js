import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        conversations: [],
        selectedConversation: null,
        messages: [],
        onlineUsers: []
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        // Real-time helper: append new message to logs if relevant
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        // Real-time helper: update the last message in conversations sidebar
        updateConversationLastMessage: (state, action) => {
            const { message, senderId, receiverId } = action.payload;
            state.conversations = state.conversations.map(conv => {
                const isMatch = (conv.otherUser._id === senderId || conv.otherUser._id === receiverId);
                if (isMatch) {
                    return {
                        ...conv,
                        lastMessage: action.payload,
                        updatedAt: new Date().toISOString()
                    };
                }
                return conv;
            }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
    }
});

export const { 
    setConversations, 
    setSelectedConversation, 
    setMessages, 
    setOnlineUsers,
    addMessage,
    updateConversationLastMessage
} = chatSlice.actions;

export default chatSlice.reducer;
