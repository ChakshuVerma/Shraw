import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);

  const getChats = useCallback(async () => {
    let conversations = [];
    setLoading(true);
    try {
      const res = await fetch(`${APIEndpoints.CONVERSATION}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      conversations = data;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }

    return conversations;
  }, []);

  return { loading, getChats };
};

export default useGetConversations;
