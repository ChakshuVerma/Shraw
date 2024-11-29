/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import NewChat from "@/components/conversation/newChat";
import AddMembersToConversation from "@/components/addMembersToConversation/addMembersToConversation";
import DeleteConversation from "../deleteConversation/deleteConversation";
import LeaveConversation from "@/components/leaveConversation/leaveConversation";

const Conversation = ({ conv, addChat }) => {
  return (
    <div className="max-w-sm px-6 py-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-6">
      {addChat ? (
        <NewChat />
      ) : (
        <>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer">
            {conv.name}
          </h5>
          {conv.isAdmin ? (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
              Admin
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              Member
            </span>
          )}
          <p className="my-3 font-normal text-gray-700 dark:text-gray-400">
            {conv.description}
          </p>
          <Link
            to={`/deep-dive/${conv._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Deep Dive
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
          {conv.isAdmin ? (
            <>
              <AddMembersToConversation conversationId={conv._id} />
              <DeleteConversation
                conversationId={conv._id}
                conversationName={conv.name}
              />
            </>
          ) : (
            <LeaveConversation
              conversationName={conv.name}
              conversationId={conv._id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Conversation;
