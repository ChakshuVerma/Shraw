import useLogout from "@/hooks/useLogout";
import { useState } from "react";
import ConfirmModal from "../modals/confirmModal";
import { Button } from "../ui/button";
const Logout = () => {
  const { loading, logout } = useLogout();
  const [response, setResponse] = useState(false);

  if (response) logout();

  const confirmMessage = `Are you sure you want to logout?`;
  const yesMessage = "Logout from Shraw";
  const noMessage = "Stay logged in";
  const toggalModalMessage = "Logout";

  return (
    !loading && (
      // <Button variant="destructive">
      <ConfirmModal
        confirmMessage={confirmMessage}
        yesMessage={yesMessage}
        noMessage={noMessage}
        toggalModalMessage={toggalModalMessage}
        setResponse={setResponse}
      ></ConfirmModal>
      // </Button>
    )
  );
};

export default Logout;
