import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import toast from "react-hot-toast";
import { loadCart } from "../utils/cart";
import {
    FiCalendar,
    FiGrid,
    FiHome,
    FiImage,
    FiLogIn,
    FiLogOut,
    FiMail,
    FiMenu,
    FiX,
} from "react-icons/fi";

export default function Header(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isLoggedIn = Boolean(token && token !== "null" && token !== "undefined" && token.trim().length > 0);

    function handleLogin() {
        setIsMenuOpen(false);
        navigate("/login");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setIsMenuOpen(false);
        toast.success("Logged out");
        navigate("/login");
    }

    const navItems = useMemo(
        () => ([
            { to: "/", label: "Home", icon: FiHome },
            { to: "/items", label: "Items", icon: FiGrid },
            { to: "/gallery", label: "Gallery", icon: FiImage },
            { to: "/booking", label: "Cart", icon: FiCalendar },
            { to: "/contact", label: "Contact", icon: FiMail },
        ]),
        []
    );

    useEffect(() => {
        const getCount = () => {
            const cart = loadCart();
            const items = Array.isArray(cart?.orderedItems) ? cart.orderedItems : [];
            return items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);
        };

        const update = () => setCartCount(getCount());

        update();
        window.addEventListener("cartUpdated", update);
        window.addEventListener("storage", update);
        return () => {
            window.removeEventListener("cartUpdated", update);
            window.removeEventListener("storage", update);
        };
    }, []);

    const showCartMark = cartCount > 0;

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

    return(
        <>
            <header className="w-full bg-accent h-[80px] sm:h-[90px] md:h-[100px] shadow-2xl flex items-center px-4 md:px-8 sticky top-0 z-50 relative">
                <img
                    src="/logo.png"
                    alt="KV Audio"
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-[150px] md:h-[150px] object-cover rounded-full hover:scale-105 transition-transform duration-300"
                />

                {/* Desktop nav */}
                <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-white text-lg font-semibold hover:text-gray-200 hover:scale-110 transition-all duration-300 ${isActive ? "text-gray-200" : ""}`
                        }
                        end
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/items"
                        className={({ isActive }) =>
                            `text-white text-lg font-semibold hover:text-gray-200 hover:scale-110 transition-all duration-300 ${isActive ? "text-gray-200" : ""}`
                        }
                    >
                        Items
                    </NavLink>
                    <NavLink
                        to="/gallery"
                        className={({ isActive }) =>
                            `text-white text-lg font-semibold hover:text-gray-200 hover:scale-110 transition-all duration-300 ${isActive ? "text-gray-200" : ""}`
                        }
                    >
                        Gallery
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `text-white text-lg font-semibold hover:text-gray-200 hover:scale-110 transition-all duration-300 ${isActive ? "text-gray-200" : ""}`
                        }
                    >
                        Contact
                    </NavLink>
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-4">
                    <NavLink
                        to="/booking"
                        className="relative text-white text-lg font-semibold hover:text-gray-200 hover:scale-110 transition-all duration-300"
                        aria-label="Booking"
                    >
                        <FaCartShopping />
                        {showCartMark && (
                            <span
                                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-600"
                                aria-label="Cart has items"
                            />
                        )}
                    </NavLink>

                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="h-10 px-5 rounded-full bg-white/95 text-accent font-semibold hover:bg-white transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="h-10 px-5 rounded-full bg-white/95 text-accent font-semibold hover:bg-white transition"
                        >
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className="md:hidden ml-auto text-white p-2"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={isMenuOpen}
                >
                    <FiMenu size={26} />
                </button>
            </header>

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
                    className={`absolute left-0 top-0 h-full w-[82%] max-w-[360px] bg-primary transition-transform duration-300 flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-accent h-[70px] px-4 flex items-center justify-between">
                        <div className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center overflow-hidden bg-white/10">
                            <img src="/logo.png" alt="KV Audio" className="w-full h-full object-cover" />
                        </div>

                        <button
                            type="button"
                            className="text-white p-2"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <FiX size={26} />
                        </button>
                    </div>

                    <nav className="py-4 flex-1">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-5 py-3 text-base font-medium transition-colors ${
                                        isActive ? "text-accent" : "text-gray-700"
                                    } hover:text-accent`
                                }
                            >
                                <Icon size={18} className="text-gray-500" />
                                <span>{label}</span>

                                {to === "/booking" && showCartMark && (
                                    <span
                                        className="ml-auto h-2.5 w-2.5 rounded-full bg-red-600"
                                        aria-label="Cart has items"
                                    />
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-5 border-t border-gray-200">
                        {isLoggedIn ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full h-11 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent text-white font-semibold hover:opacity-95 transition "
                            >
                                <FiLogOut size={18} />
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-white font-semibold hover:opacity-95 transition "
                            >
                                <FiLogIn size={18} />
                                Login
                            </button>
                        )}
                    </div>
                </aside>
            </div>
        </>
    )
}