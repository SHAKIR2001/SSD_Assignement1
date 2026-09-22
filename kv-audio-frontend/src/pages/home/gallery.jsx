import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Gallery() {
  const [state, setState] = useState("loading"); // loading | success | error
  const [items, setItems] = useState([]);
  const [activeImage, setActiveImage] = useState(null);

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

  const images = useMemo(() => {
    // Build a flat list of images with a title
    const list = [];
    for (const item of items) {
      const arr = Array.isArray(item.image) ? item.image : [];
      for (const url of arr) {
        if (url) list.push({ url, title: item.name });
      }
    }
    return list;
  }, [items]);

  return (
    <div className="w-full min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>


        {state === "loading" && (
          <div className="w-full flex justify-center items-center py-10">
            <div className="w-[50px] h-[50px] border-4 border-t-green-500 rounded-full animate-spin" />
          </div>
        )}

        {state === "success" && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setActiveImage(img)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                title={img.title}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-40 object-contain bg-gray-100"
                />
                <div className="px-3 py-2 text-sm text-gray-700 truncate">{img.title}</div>
              </button>
            ))}
          </div>
        )}

        {state === "error" && (
          <p className="text-sm text-red-600 mt-4">Could not load gallery.</p>
        )}
      </div>

      {/* Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold text-gray-800 truncate">{activeImage.title}</div>
              <button
                type="button"
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setActiveImage(null)}
              >
                Close
              </button>
            </div>
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="w-full max-h-[70vh] object-contain bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}