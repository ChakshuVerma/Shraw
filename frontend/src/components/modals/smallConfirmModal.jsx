import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const SmallConfirmModal = ({
  confirmMessage,
  yesMessage,
  noMessage,
  setResponse,
  negativeElement,
  children,
  open,
  setOpen,
}) => {
  const toggleButtonStyle = negativeElement
    ? "block px-4 py-2 text-sm text- cursor-pointer font-bold bg-red-600 rounded-lg hover:bg-red-700 text-white"
    : "block px-4 py-2 text-sm text- cursor-pointer font-bold text-red-500";

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className={toggleButtonStyle + "relative"}
      >
        {children}
        {open && (
          <div className="absolute left-10 sm:left-20 bottom-4 bg-gray-100 rounded-lg shadow-2xl dark:bg-gray-700 px-2 transition-transform transform opacity-95">
            <div className="p-4 md:p-5 text-center rounded-lg">
              <Trash2 className="mx-auto mb-4 text-gray-500 w-8 h-8" />
              <h3 className="mb-5 w-[70vw] sm:w-[300px] text-md font-normal text-gray-500 dark:text-gray-400">
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
        )}
      </div>
    </>
  );
};
SmallConfirmModal.propTypes = {
  confirmMessage: PropTypes.string.isRequired,
  yesMessage: PropTypes.string.isRequired,
  noMessage: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  setResponse: PropTypes.func.isRequired,
  negativeElement: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default SmallConfirmModal;
