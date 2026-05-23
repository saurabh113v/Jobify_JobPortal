import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setConversations } from "../redux/chatSlice";
import { toast } from "sonner";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:4000/api/v1/message/conversations", {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setConversations(res.data.conversations));
                }
            } catch (error) {
                console.error("GetConversations Hook Error:", error);
                toast.error(error.response?.data?.message || "Failed to load chats.");
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, [dispatch]);

    return { loading };
};

export default useGetConversations;
