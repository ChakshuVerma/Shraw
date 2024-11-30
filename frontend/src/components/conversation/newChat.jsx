import NewConversationModal from "@/components/modals/newConversationModal";
import { useState } from "react";
import { CirclePlus } from "lucide-react";

const NewChat = () => {
  const [showModal, setShowModal] = useState("hidden");
  return (
    <>
      <div className="max-w-sm px-6 py-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
        <CirclePlus
          className="w-20 h-20 hover:cursor-pointer"
          onClick={() => setShowModal("")}
        />
        <NewConversationModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </>
  );
};

export default NewChat;
