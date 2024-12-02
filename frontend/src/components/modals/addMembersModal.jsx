/* eslint-disable react/prop-types */
import { useState } from "react";
import { Spinner } from "@/components/spinner/Spinner";
import useAddMembersToConversation from "@/hooks/useAddMembersToConversation";
import { UserRoundPlus, X as Close } from "lucide-react";

const AddMembersModal = ({ setShowModal, showModal, conversationId }) => {
  const [memberEmail, setMemberEmail] = useState("");
  const { loading, addMember } = useAddMembersToConversation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMember({ memberEmail, conversationId });
    setShowModal("hidden");
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
                Add new member
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
                    htmlFor="newMemberEmail"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="newMemberEmail"
                    id="newMemberEmail"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="demoEmail@domain.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <Spinner dotStyles="bg-white h-3 w-3" />
                ) : (
                  <>
                    <UserRoundPlus className="w-5 h-5 me-2" />
                    Invite
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

export default AddMembersModal;
