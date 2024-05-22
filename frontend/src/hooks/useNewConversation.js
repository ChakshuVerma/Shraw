import { useState } from "react";
import toast from "react-hot-toast";

const useNewConversation = () => {
  const [loading, setLoading] = useState(false);

  const createNewConversation = async (args) => {
    // console.log(args);
    let { chatName, description } = args;
    chatName = chatName.trim();
    description = description.trim();
    const success = handleInputErrors({ chatName, description });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("/api/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: chatName,
          description,
        }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Chatroom created successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, createNewConversation };
};

const handleInputErrors = ({ chatName, description }) => {
  if (!chatName || !description) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
};

export default useNewConversation;
