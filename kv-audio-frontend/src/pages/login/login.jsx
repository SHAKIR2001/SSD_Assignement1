import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import "./login.css"
import axios from "axios"
import toast from "react-hot-toast"

export default function LoginPage(){

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get("error") === "oauth_failed") {
            toast.error("Google login failed. Please try again or use another method.");
            searchParams.delete("error");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

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
    <button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-white font-semibold text-base sm:text-lg mb-4 cursor-pointer">
      Login
    </button>
    
    <div className="w-full flex items-center justify-between mb-4">
        <hr className="w-[45%] border-gray-400" />
        <span className="text-gray-300 text-sm">or</span>
        <hr className="w-[45%] border-gray-400" />
    </div>

    {/* Continue with Google Button */}
    <button
      type="button"
      onClick={() => { window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`; }}
      className="w-full h-12 bg-white hover:bg-gray-100 transition rounded-lg text-gray-800 font-semibold text-base sm:text-lg mb-4 flex items-center justify-center gap-2 cursor-pointer"
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
      Continue with Google
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