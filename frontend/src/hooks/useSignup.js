import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/authContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

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
      const res = await fetch("/api/auth/signup", {
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
      } else if (data.message) {
        toast.success(data.message);
      } else {
        localStorage.setItem("shraw-user", JSON.stringify(data));
        setAuthUser(data);
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
