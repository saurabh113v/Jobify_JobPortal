import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import { SOCKET_BASE_URL } from "../utils/constant";
import { setOnlineUsers, addMessage, updateConversationLastMessage, setConversations } from "../redux/chatSlice";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { selectedConversation, conversations } = useSelector(state => state.chat);

    // Keep ref to selectedConversation so socket event handler always has access to the freshest state
    const selectedConvRef = useRef(selectedConversation);
    useEffect(() => {
        selectedConvRef.current = selectedConversation;
    }, [selectedConversation]);

    // Keep ref to conversations to prevent stale state closures in socket event handlers
    const conversationsRef = useRef(conversations);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    useEffect(() => {
        if (user) {
            // Establish socket connection
            const socketInstance = io(SOCKET_BASE_URL, {
                query: {
                    userId: user._id
                }
            });

            setSocket(socketInstance);

            // Listen to online status updates
            socketInstance.on("getOnlineUsers", (users) => {
                dispatch(setOnlineUsers(users));
            });

            // Listen to incoming messages globally
            socketInstance.on("newMessage", async (message) => {
                const convs = conversationsRef.current || [];
                const convExists = convs.some(conv => conv.otherUser._id === message.senderId || conv.otherUser._id === message.receiverId);

                if (!convExists) {
                    try {
                        const res = await axios.get("http://localhost:4000/api/v1/message/conversations", {
                            withCredentials: true
                        });
                        if (res.data.success) {
                            dispatch(setConversations(res.data.conversations));
                        }
                    } catch (error) {
                        console.error("Socket newMessage conversations refetch error:", error);
                    }
                } else {
                    // 1. Update the sidebar preview instantly
                    dispatch(updateConversationLastMessage(message));
                }

                // 2. If the active chat corresponds to the sender, append it to the active log
                if (selectedConvRef.current && selectedConvRef.current.otherUser._id === message.senderId) {
                    dispatch(addMessage(message));
                } else {
                    // Play a subtle notification or show a premium toast
                    toast.message("New message", {
                        description: message.message.length > 40 ? `${message.message.substring(0, 40)}...` : message.message
                    });
                }
            });

            // Clean up on disconnect/logout
            return () => {
                socketInstance.close();
                setSocket(null);
            };
        } else {
            // If user is not logged in, ensure socket is disconnected
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user, dispatch]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
