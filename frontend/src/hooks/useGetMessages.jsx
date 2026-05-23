import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";
import { toast } from "sonner";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { selectedConversation } = useSelector(state => state.chat);

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation?.otherUser?._id) return;
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:4000/api/v1/message/all/${selectedConversation.otherUser._id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.error("GetMessages Hook Error:", error);
                toast.error(error.response?.data?.message || "Failed to load chat history.");
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [selectedConversation?.otherUser?._id, dispatch]);

    return { loading };
};

export default useGetMessages;
