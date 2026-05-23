import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Send, MessageSquare, Circle, ArrowLeft, Search, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { addMessage, setSelectedConversation, updateConversationLastMessage, setConversations } from '../redux/chatSlice';
import useGetConversations from '../hooks/useGetConversations';
import useGetMessages from '../hooks/useGetMessages';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
    const dispatch = useDispatch();
    const { conversations, selectedConversation, messages, onlineUsers } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.auth);

    const [textMessage, setTextMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const messageEndRef = useRef(null);

    // Call hooks to fetch data automatically on mount/conversation change
    const { loading: loadingConversations } = useGetConversations();
    useGetMessages();

    // Scroll to bottom whenever messages list changes
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);



    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!textMessage.trim() || !selectedConversation?.otherUser?._id) return;

        const messageToSend = textMessage;
        setTextMessage(""); // instant local clear for speed

        try {
            const res = await axios.post(
                `http://localhost:4000/api/v1/message/send/${selectedConversation.otherUser._id}`,
                { message: messageToSend },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                const newMsg = res.data.newMessage;
                // Update local Redux state immediately
                dispatch(addMessage(newMsg));
 
                const convExists = conversations.some(conv => conv.otherUser._id === selectedConversation.otherUser._id);
                if (!convExists) {
                    try {
                        const convRes = await axios.get("http://localhost:4000/api/v1/message/conversations", {
                            withCredentials: true
                        });
                        if (convRes.data.success) {
                            dispatch(setConversations(convRes.data.conversations));
                            const updatedConv = convRes.data.conversations.find(c => c.otherUser._id === selectedConversation.otherUser._id);
                            if (updatedConv) {
                                dispatch(setSelectedConversation(updatedConv));
                            }
                        }
                    } catch (err) {
                        console.error("Error refetching conversations after sending:", err);
                    }
                } else {
                    dispatch(updateConversationLastMessage(newMsg));
                }
            }
        } catch (error) {
            console.error("SendMessage error:", error);
            toast.error("Failed to send message.");
        }
    };

    // Filter conversations based on search term
    const filteredConversations = conversations.filter(conv =>
        conv.otherUser.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Quick templates for instant sending
    const quickTemplates = [
        "Hi, is this position still open?",
        "When can we schedule the interview?",
        "Thank you for the update!",
        "Let me review and get back to you."
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex max-w-6xl w-full mx-auto px-4 py-8 md:py-12 gap-6 h-[calc(100vh-80px)] overflow-hidden">
                
                {/* 1. Sidebar Pane: Conversations List */}
                <div className={`w-full md:w-80 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#6A38C2]" />
                                Inbox
                            </h2>
                        </div>
                        {/* Search bar */}
                        <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#6A38C2]/30 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input 
                                type="text"
                                placeholder="Search conversation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-sm text-slate-600 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Conversations Sidebar List */}
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                        {loadingConversations ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                <span className="animate-pulse">Loading active chats...</span>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                                <MessageSquare className="w-8 h-8 text-slate-200 mb-2" />
                                <p className="text-sm">No conversations found.</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const isSelected = selectedConversation?._id === conv._id;
                                const isOnline = onlineUsers.includes(conv.otherUser._id);
                                const lastMsgText = conv.lastMessage?.message || "No messages yet";
                                
                                return (
                                    <div 
                                        key={conv._id}
                                        onClick={() => dispatch(setSelectedConversation(conv))}
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all hover:bg-slate-50 ${isSelected ? 'bg-slate-50 border border-slate-100' : 'border border-transparent'}`}
                                    >
                                        <div className="relative">
                                            <Avatar className="w-10 h-10 border border-slate-100">
                                                <AvatarImage src={conv.otherUser.profile?.profilePhoto || ""} />
                                                <AvatarFallback className="bg-[#6A38C2]/10 text-[#6A38C2] font-semibold text-sm">
                                                    {conv.otherUser.fullname[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Presence indicator */}
                                            <Circle className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white fill-current ${isOnline ? 'text-green-500' : 'text-slate-300'}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm text-slate-800 truncate">{conv.otherUser.fullname}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">{lastMsgText}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. Main Chat Panel: Conversation Window */}
                <div className={`flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${!selectedConversation ? 'hidden md:flex justify-center items-center text-slate-400' : 'flex'}`}>
                    
                    {selectedConversation ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Mobile Back Arrow */}
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="md:hidden text-slate-600 rounded-full"
                                        onClick={() => dispatch(setSelectedConversation(null))}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>

                                    <div className="relative">
                                        <Avatar className="w-10 h-10 border border-slate-100">
                                            <AvatarImage src={selectedConversation.otherUser.profile?.profilePhoto || ""} />
                                            <AvatarFallback className="bg-[#6A38C2]/10 text-[#6A38C2] font-semibold text-sm">
                                                {selectedConversation.otherUser.fullname[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Circle className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white fill-current ${onlineUsers.includes(selectedConversation.otherUser._id) ? 'text-green-500' : 'text-slate-300'}`} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{selectedConversation.otherUser.fullname}</h3>
                                        <span className="text-xs font-medium text-[#6A38C2] uppercase tracking-wider bg-[#6A38C2]/10 px-2 py-0.5 rounded-full block mt-0.5 w-fit">
                                            {selectedConversation.otherUser.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Scrollable Message Body */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, index) => {
                                        const isMyMsg = msg.senderId === user?._id;
                                        
                                        return (
                                            <motion.div 
                                                key={msg._id || index}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`flex ${isMyMsg ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${isMyMsg ? 'bg-gradient-to-r from-[#6A38C2] to-pink-500 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'}`}>
                                                    <p className="leading-relaxed break-words">{msg.message}</p>
                                                    <span className={`block text-[10px] text-right mt-1 ${isMyMsg ? 'text-white/70' : 'text-slate-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                <div ref={messageEndRef} />
                            </div>

                            {/* Templates Drawer */}
                            <div className="px-5 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto bg-white whitespace-nowrap scrollbar-none">
                                {quickTemplates.map((template, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setTextMessage(template)}
                                        className="text-xs text-[#6A38C2] bg-[#6A38C2]/5 border border-[#6A38C2]/10 hover:bg-[#6A38C2]/10 px-3 py-1.5 rounded-full transition-all shrink-0 font-medium"
                                    >
                                        {template}
                                    </button>
                                ))}
                            </div>

                            {/* Chat Input Footer */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-3 items-center bg-white">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..."
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30 focus:border-[#6A38C2]/60 focus:bg-white transition-all text-slate-700"
                                />
                                <Button 
                                    type="submit" 
                                    disabled={!textMessage.trim()}
                                    className="bg-gradient-to-r from-[#6A38C2] to-pink-500 hover:from-[#5b30a6] hover:to-[#d94680] text-white rounded-2xl w-12 h-12 flex items-center justify-center shrink-0 shadow-md shadow-pink-500/10 hover:scale-105 transition-transform"
                                >
                                    <Send className="w-5 h-5 ml-0.5" />
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-[#6A38C2]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Your Conversations</h3>
                            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                                Select an active chat thread from the inbox sidebar, or navigate to jobs/applicants to initiate a conversation with recruiters or candidates.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Chat;
