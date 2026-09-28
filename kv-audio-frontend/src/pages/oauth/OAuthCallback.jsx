import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
      withCredentials: true,
    }).then(({ data: user }) => {
      if (user.phone === "Not provided" || user.address === "Not provided") {
        toast.success("Logged in! Please complete your profile.");
        navigate("/complete-profile", { replace: true });
        return;
      }
      toast.success("Successfully logged in with Google!");
      navigate("/", { replace: true });
    }).catch(() => {
      toast.error("Authentication failed. Please login again.");
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Completing login...</p>
      </div>
    </div>
  );
}
