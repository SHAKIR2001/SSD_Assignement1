import { useState } from "react";
import "./register.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // For just checking values
    console.log({
      firstName,
      lastName,
      email,
      password,
      address,
      phone,
    });

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`,{
        email : email,
        firstName : firstName,
        lastName : lastName,
        password : password,
        address : address,
        phone : phone
    } ).then( (res)=>{
        //console.log(res)
        navigate("/login")
    }).catch( (err)=>{
      toast.error(err?.responce?.data?.error || "Error occurred")
    })


  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-picture bg-cover bg-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        {/* Card */}
        <div className="w-full p-4 sm:p-5 backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl flex flex-col items-center">

          {/* Logo */}
          <img
            src="logo.png"
            alt="Logo"
            className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] object-cover mb-2"
          />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 text-center">
            Create Account
          </h1>
          <p className="text-gray-300 mb-6 text-sm text-center">
            Please fill in the details
          </p>

          {/* First Name */}
          <div className="w-full mb-4">
            <input
              type="text"
              required
              placeholder="First Name"
              className="w-full h-10 bg-transparent border-b-2 border-gray-400 text-white text-sm sm:text-base outline-none focus:border-purple-500 transition"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="w-full mb-4">
            <input
              type="text"
              required
              placeholder="Last Name"
              className="w-full h-10 bg-transparent border-b-2 border-gray-400 text-white text-sm sm:text-base outline-none focus:border-purple-500 transition"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="w-full mb-4">
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full h-10 bg-transparent border-b-2 border-gray-400 text-white text-sm sm:text-base outline-none focus:border-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="w-full mb-4">
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full h-10 bg-transparent border-b-2 border-gray-400 text-white text-sm sm:text-base outline-none focus:border-purple-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="w-full mb-4">
            <input
              type="text"
              required
              placeholder="Address"
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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full h-10 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-white font-semibold text-sm sm:text-base cursor-pointer"
          >
            Register
          </button>

        </div>
      </form>
    </div>
  );
}
