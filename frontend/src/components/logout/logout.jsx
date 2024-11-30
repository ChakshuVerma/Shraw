import useLogout from "@/hooks/useLogout";
import { useState, useEffect } from "react";
import ConfirmModal from "../modals/confirmModal";

import { Spinner } from "@/components/spinner/Spinner";
const Logout = () => {
  const { loading, logout } = useLogout();
  const [response, setResponse] = useState(false);

  useEffect(() => {
    if (response) logout();
  });

  const confirmMessage = `Are you sure you want to logout?`;
  const yesMessage = "Logout from Shraw";
  const noMessage = "Stay logged in";
  const toggalModalMessage = "Logout";

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ConfirmModal
          confirmMessage={confirmMessage}
          yesMessage={yesMessage}
          noMessage={noMessage}
          toggalModalMessage={toggalModalMessage}
          setResponse={setResponse}
        ></ConfirmModal>
      )}
    </>
  );
};

export default Logout;
