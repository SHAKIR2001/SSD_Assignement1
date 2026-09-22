import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./login.css"
import axios from "axios"
import toast from "react-hot-toast"

export default function LoginPage(){

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()

    function handleOnSubmit(e){
        e.preventDefault()

        const backendUrl = import.meta.env.VITE_BACKEND_URL
        axios.post(`${backendUrl}/api/users/login`, {
            email : email, //backend il ulla email & password itku ingu useState moolam eduthth emailum & passowrd ei kuduththal
            password : password
        }).then(
            (res)=>{
                console.log(res)
                toast.success("Login Success, Welcome "+res.data.user.lastName)
                const user = res.data.user //identify this from browser console(res.data.user)
                localStorage.setItem("token", res.data.token) //store the key and value in the  cashe table(token)
                 
               if(user.role === "admin"){
                    navigate("/admin/orders")
                }else{
                    navigate("/")
                }
            }
        ).catch(
            (err)=>{
                console.log(err)
                toast.error(err?.response?.data?.message )
                
               
            }
        )
    
    }

    return(

<div className="w-full min-h-screen flex justify-center items-center bg-picture bg-cover bg-center px-4 py-10">
 <form onSubmit={handleOnSubmit} className="w-full max-w-md">
  {/* Card */}
  <div className="w-full p-6 sm:p-8 backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl flex flex-col items-center">

    {/* Logo */}
    <img
      src="logo.png"
      alt="Logo"
      className="w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] object-cover"
    />

    {/* Title */}
    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
      Welcome Back
    </h1>
    <p className="text-gray-300 mb-7 sm:mb-8 text-sm text-center">
      Please login to continue
    </p>

    {/* Email */}
    <div className="w-full mb-5">

      <input
        type="email"
        placeholder="Email"
        className="w-full h-12 bg-transparent border-b-2 border-gray-400 text-white text-base sm:text-lg outline-none focus:border-purple-500 transition"
        value={email}
        onChange={
            (e)=>{
                setEmail(e.target.value)
            }}
      />
    </div>

    {/* Password */}
    <div className="w-full mb-6">
      <input
        type="password"
        placeholder="Password"
        className="w-full h-12 bg-transparent border-b-2 border-gray-400 text-white text-base sm:text-lg outline-none focus:border-purple-500 transition"
        value = {password}
        onChange={
            (e)=>{
                setPassword(e.target.value)
            }}
      />
    </div>

    {/* Login Button */}
    <button className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-white font-semibold text-base sm:text-lg mb-4 cursor-pointer">
      Login
    </button>

    <div className="w-full flex items-center justify-center gap-2 text-sm text-gray-200">
      <span className="text-gray-300">Don&apos;t have an account?</span>
      <button
        type="button"
        onClick={() => navigate("/register")}
        className="font-semibold text-white underline underline-offset-4 hover:text-gray-100 transition cursor-pointer"
      >
        Sign up
      </button>
    </div>



  </div>
  </form>
</div>
    )
}