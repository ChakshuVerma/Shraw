import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyUser = () => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const queryParameters = new URLSearchParams(window.location.search);
        const providedVerificationString =
          queryParameters.get("verificationString");
        const userId = queryParameters.get("id");

        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providedVerificationString,
            userId,
          }),
        });

        const data = await res.json();
        // console.log(data);
        if (data.error) {
          throw new Error(data.error);
        } else if (data.message) {
          setVerified(true);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    verify();
  }, []);

  // setTimeout(() => Navigate("/login"), 1500);

  return <>{verified ? <div>User Verified</div> : <div>Verifying...</div>}</>;
};

export default VerifyUser;
