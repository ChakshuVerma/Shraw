import useCheckAuthority from "@/hooks/useCheckAuthority";
import { Spinner } from "@/components/spinner/Spinner";
import Canvas from "@/components/canvas/canvas";
import useChat from "@/zustand/useChat";
import { useEffect } from "react";

const ChatPage = () => {
  const { selectedChat, setSelectedChat } = useChat();

  const conversationId = window.location.href.split("deep-dive/")[1];
  const { isAuthorized, loading, conversationDetails } =
    useCheckAuthority(conversationId);

  useEffect(() => {
    if (isAuthorized) {
      setSelectedChat(conversationDetails);
    } else {
      setSelectedChat(null);
    }

    return () => {
      if (selectedChat) setSelectedChat(null);
    };
  }, [isAuthorized, conversationDetails, setSelectedChat, selectedChat]);

  return <>{loading ? <Spinner /> : isAuthorized && <Canvas />}</>;
};

export default ChatPage;
