import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";


export default function AddProduct() {
  const [productKey, setProductKey] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productCatagorie, setProductCatagorie] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productDimensions, setProductDimensions] = useState("");
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();

  async function handleAddItem() {
   
    const promises = []

    for(let i=0; i<productImages.length; i++){
      const promise = mediaUpload(productImages[i])
      promises.push(promise)
      if( i == 5){
        toast.error("You can upload only 4 images at a time");
        break;
      }
    }

  console.log(
    productKey,
    productName,
    productPrice,
    productCatagorie,
    productDescription,
    productDimensions
  );

  const token = localStorage.getItem("token"); // get token from localStorage

  if (token) {
    try {

     /*  Promise.all(promises).then( (result)=>{  //Promises.all enbadhu ore thadaweyyil pala promise halai run seiyya ull predefine js thing
        console.log(result)
      }).catch( (err)=>{
      toast.error(err)
      }) */

      const imageUrls = await Promise.all(promises);

      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          key: productKey, // backend(key) ← useState(productKey)
          name: productName,
          price: productPrice,
          category: productCatagorie,
          dimensions: productDimensions,
          description: productDescription,
          image : imageUrls,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success(result.data.message);
      navigate("/admin/items")

    } catch (e) {
      toast.error(e.response.data.error);
    }
  } else {
    toast.error("You are not authorized to add items");
  }
}

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start px-4 py-8 md:py-10">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add New Product
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Product Key */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Key
            </label>
            <input
              type="text"
              placeholder="e.g. JBL-AUD-001"
              value={productKey}
              onChange={(e) => setProductKey(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (LKR)
            </label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              value={productCatagorie}
              onChange={(e) => setProductCatagorie(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select category</option>
              <option value="audio">Audio</option>
              <option value="lights">Lights</option>
            </select>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Dimensions
            </label>
            <input
              type="text"
              placeholder="10cm x 8cm x 5cm"
              value={productDimensions}
              onChange={(e) => setProductDimensions(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Short product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Images */}
          <div>
            <input type="file"
              multiple
              className="
               cursor-pointer
               text-sm
               file:mr-3
               file:rounded
               file:border file:border-gray-400
               file:bg-white
               file:px-3 file:py-1.5
               file:text-sm
               file:cursor-pointer
               hover:file:bg-gray-50
               "
               onChange={(e)=>{setProductImages(e.target.files)}}         
      
            />





          </div>

          {/* Button */}
          <button onClick={handleAddItem}  className="mt-4 h-12 bg-purple-600 hover:bg-purple-700 transition rounded-lg text-white font-semibold">
            Add Product
          </button>

          {/* Button */}
          <button onClick={()=>{navigate("/admin/items")}}className="mt-4 h-12 bg-red-600 hover:bg-red-700 transition rounded-lg text-white font-semibold">
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}
