/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import AddMembersToConversation from "@/components/addMembersToConversation/addMembersToConversation";
import DeleteConversation from "../deleteConversation/deleteConversation";
import LeaveConversation from "@/components/leaveConversation/leaveConversation";
import Dropdown from "../dropdown/Dropdown";
import Skeleton from "../skeleton/Skeleton";

const Conversation = ({ conv }) => {
  const [adminPic, setAdminPic] = useState("");
  const [convoCoverPic, setConvoCoverPic] = useState("");
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

  useEffect(() => {
    const img = new Image();
    img.src = conv.admin.profilePic;
    img.onload = () => {
      setAdminPic(conv.admin.profilePic);
    };
  }, [conv.admin.profilePic]);

  useEffect(() => {
    const img = new Image();
    img.src = conv.coverPicture;
    img.onload = () => {
      setConvoCoverPic(conv.coverPicture);
    };
  }, [conv.coverPicture]);

  const contentLoaded = adminPic.length > 0 && convoCoverPic.length > 0;

  return (
    <div
      className="max-w-sm px-6 py-3  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2 bg-center bg-no-repeat bg-gray-700 bg-blend-multiply bg-cover w-full"
      style={{ backgroundImage: `url(${contentLoaded ? convoCoverPic : ""})` }}
    >
      {!contentLoaded ? (
        <Skeleton />
      ) : (
        <>
          <div className="flex justify-between flex-wrap">
            <div className="h-auto w-auto max-w-sm">
              <h5 className="text-2xl pr-6 font-bold tracking-tight text-white dark:text-white cursor-pointer truncate overflow-hidden whitespace-nowrap">
                {conv.name}
              </h5>
              <Link>
                <div className="flex items-center gap-2">
                  <img
                    className="w-5 h-5 rounded-full border-2 border-black"
                    src={adminPic}
                    alt="Admin"
                  ></img>
                  <span className="dark:text-white font-medium text-white text-xs">
                    <div>{conv.admin.username}</div>
                  </span>
                </div>
              </Link>
            </div>
            <Dropdown
              dropDownElements={dropDownElements}
              dropDownStyles={"text-white"}
            />
          </div>
          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <p className="my-3 font-normal text-white dark:text-gray-400 word-break break-all">
            {conv.description}
          </p>
          <Link
            to={`/deep-dive/${conv._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Deep Dive
            <MoveRight className="w-4 h-4 ms-2" />
          </Link>
        </>
      )}
    </div>
  );
};

export default Conversation;
