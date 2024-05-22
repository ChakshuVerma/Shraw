import Logout from "@/components/logout/logout";
import useGetConversations from "@/hooks/useGetConversation";
import Conversation from "@/components/conversation/Conversation";
import { Spinner } from "@/components/spinner/Spinner";

const Home = () => {
  const { loading, conversations } = useGetConversations();
  const nameOfUser = JSON.parse(localStorage.getItem("shraw-user")).name;
  // console.log(conversations);
  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 md:h-screen p-6 flex flex-col">
        <div className="info-container mb-8">
          <div className="flex justify-between">
            <div className="text-4xl font-bold">
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
        <div className="allChats flex items-center p-10 bg-slate-100 justify-center flex-wrap overflow-auto">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {conversations.map((conversation) => {
                return (
                  <Conversation
                    key={conversation._id}
                    conv={conversation}
                    addChat={false}
                  />
                );
              })}
              <Conversation addChat={true} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
