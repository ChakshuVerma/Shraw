import useLogout from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

const Logout = () => {
  const { loading, logout } = useLogout();

  const confirmResponse = () => {
    const answer = confirm("Are you sure you want to logout ? ");
    if (answer) logout();
  };

  return (
    <div className="mt-auto">
      {!loading ? (
        <Button
          variant="destructive"
          onClick={confirmResponse}
          className="mr-10"
        >
          Logout
        </Button>
      ) : (
        <span className="animate-spin h-5 w-5 mr-3"></span>
      )}
    </div>
  );
};

export default Logout;
