/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddMembersModal from "@/components/modals/addMembersModal";

const AddMembersToConversation = ({ conversationId }) => {
  const [showModal, setShowModal] = useState("hidden");
  return (
    <>
      <Button
        variant="outline"
        className="m-4"
        onClick={() => setShowModal("")}
      >
        Add Members
      </Button>
      <AddMembersModal
        showModal={showModal}
        setShowModal={setShowModal}
        conversationId={conversationId}
      />
    </>
  );
};

export default AddMembersToConversation;
