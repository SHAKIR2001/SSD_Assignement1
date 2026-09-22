import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";


export default function AdminItemsPage() {
  const [items, setItems] = useState([]); //1st load ahum podhu empty array ondru koduththu weiththal
  const [itemsLoaded, setItemsLoaded] = useState(false)
  const navigate = useNavigate();

  
  useEffect(() => {
    if(!itemsLoaded){

     const token = localStorage.getItem("token");
     
     axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setItems(res.data);
        setItemsLoaded(true);

      })
      .catch(() => {
        toast.error("Cannot find the items");
      });     
      
    }

  }, [itemsLoaded]);
  
  function handleDelete(key){
    if(window.confirm( "Are you sure you want to delete this product?")){
      setItems(items.filter( (item)=>item.key !== key)) //check delete key(item.key) itku euqual illaadha key iruppadhei mattum shows seidhal ; even without this its working perfectly
      const token = localStorage.getItem("token")
      axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`,{
        headers : { Authorization: `Bearer ${token}`},

      }).then(
        (res)=>{
          console.log(res.data)
          setItemsLoaded(false);
         // window.location.reload(); reload the page after the deletion happens {idhatku padhilaaha useEffect il ulla itemsLoaded use seiyyappadum }
        }
      ).catch(
        (err)=>{
          console.log(err)
        }
      )

    }
  }
  

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-6 relative flex flex-col items-center">
      {!itemsLoaded &&<div className="border-4 my-4 rounded-full w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-b-green-500 animate-spin"></div>}
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Product Management
      </h1>
      

      {/* Table Card */}
      {itemsLoaded &&<div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-x-auto">

        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Key</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price (LKR)</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Dimensions</th>
              <th className="px-4 py-3 text-left">Availability</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((product, index) => (  //"product" just the name of the current element you’re iterating over even we can use "shakir" then shakir.key like that
              <tr
                key={index} //index is the position number of the current element while looping the array
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm">{product.key}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm">{product.price}</td>
                <td className="px-4 py-3 text-sm">{product.category}</td>
                <td className="px-4 py-3 text-sm">{product.dimensions}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.availability
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.availability ? "Available" : "Not Available"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-3">

                    {/* Edit */}
                    <button onClick={()=>{navigate("/admin/items/edit", {state:product})}} //pass the product details to the productEdit page through "product"
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition cursor-pointer"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>

                    {/* Delete */}
                    <button onClick={()=>{
                      handleDelete(product.key)
                    }}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer "
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Add Item Floating Button */}
      <Link to="/admin/items/add">
        <CiCirclePlus className="text-[64px] md:text-[80px] text-purple-600 hover:text-purple-800 cursor-pointer fixed bottom-5 right-5 md:bottom-6 md:right-6 drop-shadow-lg" />
      </Link>
    </div>
  );
}
