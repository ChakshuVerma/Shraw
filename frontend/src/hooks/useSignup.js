import { useState } from "react";
import toast from "react-hot-toast";
import { APIEndpoints } from "@/constants/constants";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async ({
    name,
    username,
    password,
    confirmPassword,
    email,
  }) => {
    const success = handleInputErrors({
      name,
      username,
      password,
      confirmPassword,
      email,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch(APIEndpoints.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          password,
          confirmPassword,
          email,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          toast.success("Redirecting to login page");
        }, 500);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};
export default useSignup;

function handleInputErrors({
  name,
  username,
  password,
  confirmPassword,
  email,
}) {
  if (!name || !username || !password || !confirmPassword || !email) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
