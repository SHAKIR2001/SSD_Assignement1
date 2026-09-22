import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";

export default function Items() {
  const [state, setState] = useState("loading"); // loading | success | error
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all"); // all | audio | lights

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cat = String(category || "all").toLowerCase();

    return (Array.isArray(items) ? items : []).filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const itemCategory = String(item?.category || "").toLowerCase();

      const matchesSearch = q ? name.includes(q) : true;
      const matchesCategory = cat === "all" ? true : itemCategory === cat;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  useEffect(() => {
    if(state == "loading"){
      axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`) //dont get any tokens bcs prodcuts can be view by anyone
      .then((res) => {
        setItems(res.data);
        setState("success");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error || "Error occurred");
        setState("error");
      });
    }

  }, []);

  return (
    <div className="w-full min-h-screen pt-[50px]">
      {/* Controls */}
      <div className="w-full px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name..."
            className="w-full md:flex-1 h-11 rounded-xl border border-gray-200 bg-white px-4 outline-none focus:ring-2 focus:ring-purple-300"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-56 h-11 rounded-xl border border-gray-200 bg-white px-3 outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">All categories</option>
            <option value="audio">Audio</option>
            <option value="lights">Lights</option>
          </select>
        </div>
      </div>

      {state === "loading" && 
        <div className="w-full h-screen flex justify-center items-center">
          <div className="w-[50px] h-[50px] border-4 border-t-green-500 rounded-full animate-spin" />
        </div>
      }

      {state === "success" && 
        <>
          {filteredItems.length === 0 ? (
            <div className="w-full px-4 md:px-8 mt-8">
              <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 text-center">
                <div className="text-sm font-semibold text-gray-800">No items found</div>
                <div className="text-xs text-gray-500 mt-1">Try a different search or category.</div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-wrap justify-center gap-6 mt-6 px-2">
              {filteredItems.map((item) => ( //right side item is just a parameter name we pass items to the item
                <ProductCard key={item.key} item={item} />  //left side item is a prop we transfer the item details to productCard.jsx through the props call item define the 
              ))}
            </div>
          )}
        </>
      }
    </div>
  );
}