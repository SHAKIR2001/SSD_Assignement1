import { BsGraphDown } from "react-icons/bs";
import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { MdOutlineSpeaker } from "react-icons/md";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import AdminItemsPage from "./adminItemsPage";
import AddProduct from "./addProductPage"
import UpdateProduct from "./updateItemPage";
import AdminUsersPage from "./adminUsersPage";
import AdminOrderPage from "./adminOrderPage";
import AdminContactPage from "./adminContactPage";
import { useState,useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLogOut, FiMail, FiMenu, FiX } from "react-icons/fi";

export default function AdminPage(props){

  const [userValidated, setUserValidated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    toast.success("Logged out");
    navigate("/login");
  }

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(!token){ 
      window.location.href = "/login";
    }
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`,{
      headers : {
        Authorization: `Bearer ${token}`
      }
    }).then((res)=>{
      console.log(res.data)
      const user = res.data

      if(user.role !== "admin"){
        window.location.href ="/"; //if the user is customer he is goes to homepage
      }else{
        setUserValidated(true) // if user is an admin 
      }
      
    }).catch((err)=>{
      console.log(err)
      setUserValidated(false);
    })


  },[])


    return(
    <div className="w-full min-h-screen bg-primary">
      {/* Sidebar */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:w-[240px] bg-accent text-white shadow-2xl">
        {/* Brand / Title */}
        <div className="h-[70px] md:h-[100px] flex items-center px-4 md:px-5 border-b border-white/15">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-wide">KV Admin</span>
            <span className="text-xs text-white/75">Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <div className="p-3 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <button className="shrink-0 whitespace-nowrap w-auto md:w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 transition">
            <BsGraphDown className="text-lg" />
            Dashboard
          </button>

          <Link
            to="/admin/orders"
            className="shrink-0 whitespace-nowrap w-auto md:w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl bg-white/0 hover:bg-white/10 transition no-underline text-white"
          >
            <FaRegBookmark className="text-lg" />
            Orders
          </Link>

          <Link
            to="/admin/items"
            className="shrink-0 whitespace-nowrap w-auto md:w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl bg-white/0 hover:bg-white/10 transition no-underline text-white"
          >
            <MdOutlineSpeaker className="text-lg" />
            Items
          </Link>

          <Link
            to="/admin/users"
            className="shrink-0 whitespace-nowrap w-auto md:w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl bg-white/0 hover:bg-white/10 transition no-underline text-white"
          >
            <FaRegUser className="text-lg" />
            Users
          </Link>

          <Link
            to="/admin/messages"
            className="shrink-0 whitespace-nowrap w-auto md:w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl bg-white/0 hover:bg-white/10 transition no-underline text-white"
          >
            <FiMail className="text-lg" />
            Messages
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen min-w-0 md:pl-[240px]">
        {/* Top bar */}
        <div className="h-[70px] md:h-[100px] bg-white shadow flex items-center px-4 md:px-6 sticky top-0 z-40 relative">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-1">Manage bookings, items, and users</p>
          </div>

          {/* Top-right actions */}
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-accent text-white font-semibold shadow-sm hover:opacity-95 transition cursor-pointer"
              title="Logout"
            >
              Logout
            </button>

            <button
              type="button"
              className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl bg-accent text-white shadow cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open admin menu"
              aria-expanded={isMenuOpen}
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden fixed inset-0 z-[60] ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!isMenuOpen}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Panel */}
          <aside
            className={`absolute left-0 top-0 h-full w-[82%] max-w-[320px] bg-accent text-white shadow-2xl transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            <div className="h-[70px] flex items-center justify-between px-4 border-b border-white/15">
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-wide">KV Admin</span>
                <span className="text-xs text-white/75">Dashboard</span>
              </div>

              <button
                type="button"
                className="text-white p-2"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close admin menu"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <button className="w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 transition">
                <BsGraphDown className="text-lg" />
                Dashboard
              </button>

              <Link
                to="/admin/orders"
                className="w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl hover:bg-white/10 transition no-underline text-white"
              >
                <FaRegBookmark className="text-lg" />
                Orders
              </Link>

              <Link
                to="/admin/items"
                className="w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl hover:bg-white/10 transition no-underline text-white"
              >
                <MdOutlineSpeaker className="text-lg" />
                Items
              </Link>

              <Link
                to="/admin/users"
                className="w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl hover:bg-white/10 transition no-underline text-white"
              >
                <FaRegUser className="text-lg" />
                Users
              </Link>

              <Link
                to="/admin/messages"
                className="w-full h-11 text-sm font-semibold cursor-pointer flex items-center gap-3 px-4 rounded-xl hover:bg-white/10 transition no-underline text-white"
              >
                <FiMail className="text-lg" />
                Messages
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full h-11 text-sm font-semibold cursor-pointer flex items-center justify-center px-4 rounded-xl bg-white/10 hover:bg-white/15 transition"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>

        {/* Routed pages container */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {userValidated &&<Routes path="/*">
              <Route path="/orders" element={<AdminOrderPage/>}/>
              <Route path="/items" element={<AdminItemsPage/>}/>
              <Route path="/items/add" element={<AddProduct/>} />
              <Route path="/items/edit" element={<UpdateProduct/>} />
              <Route path="/users" element={<AdminUsersPage/>} />
              <Route path="/messages" element={<AdminContactPage/>} />
            </Routes>}
          </div>
        </div>
      </div>
    </div>
    )
}