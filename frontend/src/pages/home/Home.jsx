import Logout from "@/components/logout/logout";
import useGetConversations from "@/hooks/useGetConversation";
import Conversation from "@/components/conversation/Conversation";
import { Spinner } from "@/components/spinner/Spinner";
import modalToggleContext from "@/context/conversationListContext";
import NewChat from "@/components/conversation/newChat";
import { useEffect, useState } from "react";

const Home = () => {
  const { loading, getChats } = useGetConversations();
  const [conversations, setConversations] = useState([]);
  const [conversationListChanged, setConversationListChanged] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats();
      setConversations(chats);
    };
    fetchChats();
  }, [conversationListChanged, getChats]);

  const nameOfUser = JSON.parse(localStorage.getItem("shraw-user")).name;

  return (
    <>
      <modalToggleContext.Provider
        value={{ conversationListChanged, setConversationListChanged }}
      >
        <div className="bg-gray-50 dark:bg-gray-900 flex flex-col p-1 sm:p-6 h-screen">
          <div className="info-container mb-8">
            <div className="flex justify-between items-start pt-4">
              <div className="text-2xl sm:text-4xl font-bold mr-3">
                Hello, <span className="text-green-900">{nameOfUser}</span>
              </div>
              <Logout />
            </div>
            <div className="text-7xl text-center text-blue-600">
              <b>Shraw</b>
            </div>
            <div className="text-2xl text-center mt-4">
              A simple tool for collaborative drawing
            </div>
          </div>
          <div className="flex justify-center items-center flex-col bg-slate-100 p-2 h-full">
            <div className="flex items-center justify-center flex-wrap w-full overflow-y-auto scrollbar-hide">
              {loading ? (
                <Spinner
                  loadingMessageStyles={"text-black"}
                  loadingMessage={"Fetching chats..."}
                />
              ) : (
                <>
                  {conversations.map((conversation) => {
                    return (
                      <Conversation
                        key={conversation._id}
                        conv={conversation}
                      />
                    );
                  })}
                  <NewChat />
                </>
              )}
            </div>
          </div>
        </div>
      </modalToggleContext.Provider>
    </>
  );
};

export default Home;
