import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      
      // Clear hash
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      
      toast.success("Successfully logged in with Google!");
      
      // Navigate to home (same as login.jsx for customers)
      navigate("/");
    } else {
      toast.error("Authentication failed. No token received.");
      navigate("/login");
    }
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
