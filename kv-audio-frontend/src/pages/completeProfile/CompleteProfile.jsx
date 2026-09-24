import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CompleteProfile() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
    }

    axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, 
      { address, phone },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        // Save the new updated token that contains the new phone and address
        localStorage.setItem("token", res.data.token);
        toast.success("Profile updated successfully!");
        navigate("/");
    }).catch((err) => {
      toast.error(err?.response?.data?.error || "Error updating profile");
    });
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-900 px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="w-full p-4 sm:p-5 backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">
            Almost Done!
          </h1>
          <p className="text-gray-300 mb-6 text-sm text-center">
            Please complete your profile to continue
          </p>

          {/* Address */}
          <div className="w-full mb-4">
            <input
              type="text"
              required
              placeholder="Shipping Address"
              className="w-full h-10 bg-transparent border-b-2 border-gray-400 text-white text-sm sm:text-base outline-none focus:border-purple-500 transition"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="w-full mb-6">
            <input
              type="text"
              required
              placeholder="Phone Number"
              className="w-full h-10 bg-transparent border-b-2 border-gray-400 text-white text-sm sm:text-base outline-none focus:border-purple-500 transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-white font-semibold text-sm sm:text-base cursor-pointer"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
