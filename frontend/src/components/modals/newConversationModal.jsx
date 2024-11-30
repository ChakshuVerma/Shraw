import { useState, useContext } from "react";
import useNewConversation from "@/hooks/useNewConversation";
import { Spinner } from "@/components/spinner/Spinner";
import conversationListContext from "@/context/conversationListContext";
import { X as Close, Plus } from "lucide-react";

// eslint-disable-next-line react/prop-types
const NewConversaionModal = ({ showModal, setShowModal }) => {
  const { conversationListChanged, setConversationListChanged } = useContext(
    conversationListContext
  );
  const [newConversation, setNewConversation] = useState({
    chatName: "",
    description: "",
  });

  const { loading, createNewConversation } = useNewConversation();

  const handleChange = (e) => {
    setNewConversation({
      ...newConversation,
      [e.target.name]: e.target.value.trimStart(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewConversation({
      chatName: newConversation.chatName.trim(),
      description: newConversation.description.trim(),
    });
    await createNewConversation(newConversation);
    setShowModal("hidden");
    setNewConversation({ chatName: "", description: "" });
    // So that the home component re-renders and fetches the new conversation list
    setConversationListChanged(!conversationListChanged);
  };

  return (
    <>
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${showModal} +  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full  bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                New ChatRoom
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
                onClick={() => setShowModal("hidden")}
              >
                <Close className="w-5 h-5" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="chatName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="chatName"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type Chat Room name"
                    required
                    minLength={3}
                    maxLength={20}
                    value={newConversation.chatName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    description
                  </label>
                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write Chat Room description here"
                    value={newConversation.description}
                    minLength={5}
                    maxLength={100}
                    required
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Plus className="me-1 -ms-1 w-5 h-5" />
                    Create Chatroom
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewConversaionModal;
