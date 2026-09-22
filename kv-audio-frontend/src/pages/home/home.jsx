import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";

export default function Home() {
  const [state, setState] = useState("loading"); // loading | success | error
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((res) => {
        setItems(res.data || []);
        setState("success");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error || "Error occurred");
        setState("error");
      });
  }, []);

  const featured = useMemo(() => items.slice(0, 3), [items]);

  return (
    <div className="w-full min-h-screen px-6 py-10">
      {/* Hero */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          KV Audio & Lights
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl">
          Browse quality audio gear and lighting products. View details, check availability,
          and pick what fits your setup.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/items"
            className="h-11 px-5 inline-flex items-center justify-center rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition no-underline"
          >
            Browse Items
          </Link>

          <Link
            to="/contact"
            className="h-11 px-5 inline-flex items-center justify-center rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition no-underline"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-gray-800">Reliable Products</h3>
          <p className="text-sm text-gray-600 mt-1">
            Curated items with clear specs, dimensions, and categories.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-gray-800">Quick Browsing</h3>
          <p className="text-sm text-gray-600 mt-1">
            Clean product cards and a dedicated details page per item.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-gray-800">Availability Info</h3>
          <p className="text-sm text-gray-600 mt-1">
            See availability status before you decide.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Featured Items</h2>
          <Link to="/items" className="text-purple-700 font-semibold no-underline hover:underline">
            View all
          </Link>
        </div>

        {state === "loading" && (
          <div className="w-full flex justify-center items-center py-10">
            <div className="w-[50px] h-[50px] border-4 border-t-green-500 rounded-full animate-spin" />
          </div>
        )}

        {state === "success" && (
          <div className="mt-6 w-full flex flex-wrap justify-center md:justify-start gap-6">
            {featured.map((item) => (
              <ProductCard key={item.key} item={item} />
            ))}
          </div>
        )}

        {state === "error" && (
          <p className="text-sm text-red-600 mt-4">Could not load featured items.</p>
        )}
      </section>
    </div>
  );
}