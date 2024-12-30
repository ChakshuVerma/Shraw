import { APIEndpoints } from "@/constants/constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyUser = () => {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const verify = async () => {
      try {
        const queryParameters = new URLSearchParams(window.location.search);
        const providedVerificationString =
          queryParameters.get("verificationString");
        const userId = queryParameters.get("id");

        const res = await fetch(APIEndpoints.VERIFY_EMAIL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providedVerificationString,
            userId,
          }),
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        } else if (data.message) {
          setVerified(true);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          toast.success("Redirecting to login page");
        }, 100);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };
    verify();
  }, []);

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center text-5xl font-bold">
        {verified ? <div>User Verified</div> : <div>Verifying...</div>}
      </div>
    </>
  );
};

export default VerifyUser;
