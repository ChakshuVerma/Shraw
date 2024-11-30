/* eslint-disable react/prop-types */
import { useState } from "react";
import AddMembersModal from "@/components/modals/addMembersModal";

const AddMembersToConversation = ({ conversationId }) => {
  const [showModal, setShowModal] = useState("hidden");
  return (
    <>
      <div
        onClick={() => setShowModal("")}
        className="block px-4 py-2 font-bold text-sm cursor-pointer text-gray-700 hover:bg-gray-100 "
      >
        Invite members
      </div>
      <AddMembersModal
        showModal={showModal}
        setShowModal={setShowModal}
        conversationId={conversationId}
      />
    </>
  );
};

export default AddMembersToConversation;
