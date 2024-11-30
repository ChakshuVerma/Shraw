/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import AddMembersToConversation from "@/components/addMembersToConversation/addMembersToConversation";
import DeleteConversation from "../deleteConversation/deleteConversation";
import LeaveConversation from "@/components/leaveConversation/leaveConversation";
import Dropdown from "../dropdown/Dropdown";

const Conversation = ({ conv }) => {
  const dropDownElements = conv.isAdmin
    ? [
        <AddMembersToConversation key={conv._id} conversationId={conv._id} />,
        <DeleteConversation
          key={conv._id}
          conversationId={conv._id}
          conversationName={conv.name}
        />,
      ]
    : [
        <LeaveConversation
          key={conv._id}
          conversationName={conv.name}
          conversationId={conv._id}
        />,
      ];

  return (
    <div className="max-w-sm px-6 py-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
      <div className="flex justify-between flex-wrap">
        <div className="h-auto w-auto max-w-sm">
          <h5 className="text-2xl pr-6 font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer truncate overflow-hidden whitespace-nowrap">
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
        </div>
        <Dropdown dropDownElements={dropDownElements} />
      </div>
      <p className="my-3 font-normal text-gray-700 dark:text-gray-400 word-break break-all">
        {conv.description}
      </p>
      <Link
        to={`/deep-dive/${conv._id}`}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Deep Dive
        <MoveRight className="w-4 h-4 ms-2" />
      </Link>
    </div>
  );
};

export default Conversation;
