import NewConversationModal from "@/components/modals/newConversationModal";
import { useContext } from "react";
import modalToggleContext from "@/context/modalToggleContext";

const NewChat = () => {
  const { setShowModal } = useContext(modalToggleContext);
  return (
    <>
      <svg
        onClick={() => setShowModal("")}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-20 h-20 hover:cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <NewConversationModal />
    </>
  );
};

export default NewChat;
