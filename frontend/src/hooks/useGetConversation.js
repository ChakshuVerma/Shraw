import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getChats();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
