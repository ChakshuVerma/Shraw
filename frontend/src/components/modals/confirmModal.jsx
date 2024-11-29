import PropTypes from "prop-types";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const ConfirmModal = ({
  confirmMessage,
  yesMessage,
  noMessage,
  toggalModalMessage,
  setResponse,
}) => {
  const [open, setOpen] = useState(false);
  //   console.log("open", open);
  return (
    <>
      <Button onClick={() => setOpen(!open)} variant="destructive">
        {toggalModalMessage}
      </Button>
      {open && (
        <div
          tabIndex="-1"
          className="overflow-y-auto overflow-x-hidden fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full  bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  {confirmMessage}
                </h3>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setResponse(true), setOpen(false);
                  }}
                >
                  {yesMessage}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setResponse(false), setOpen(false);
                  }}
                >
                  {noMessage}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
ConfirmModal.propTypes = {
  confirmMessage: PropTypes.string.isRequired,
  yesMessage: PropTypes.string.isRequired,
  noMessage: PropTypes.string.isRequired,
  toggalModalMessage: PropTypes.string.isRequired,
  setResponse: PropTypes.func.isRequired,
};

export default ConfirmModal;
