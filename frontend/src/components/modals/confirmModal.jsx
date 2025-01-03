import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X as Close, CircleAlert } from "lucide-react";

const ConfirmModal = ({
  confirmMessage,
  yesMessage,
  noMessage,
  toggalModalMessage,
  setResponse,
  negativeElement,
}) => {
  const [open, setOpen] = useState(false);

  const toggleButtonStyle = negativeElement
    ? "block px-4 py-2 text-sm text- cursor-pointer font-bold bg-red-600 rounded-lg hover:bg-red-700 text-white"
    : "block px-4 py-2 text-sm text- cursor-pointer font-bold text-red-500 hover:bg-gray-100";

  return (
    <>
      <div onClick={() => setOpen(!open)} className={toggleButtonStyle}>
        {toggalModalMessage}
      </div>
      {open && (
        <div className="fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 px-2">
              <button
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setOpen(false)}
              >
                <Close size={16} />
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center ">
                <CircleAlert className="mx-auto mb-4 text-gray-500 w-12 h-12" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  {confirmMessage}
                </h3>
                <div className="flex justify-center space-x-4 flex-wrap">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setResponse(true), setOpen(false);
                    }}
                  >
                    {yesMessage}
                  </Button>
                  <Button
                    variant="secondary"
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
  negativeElement: PropTypes.bool,
};

export default ConfirmModal;
