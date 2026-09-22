import { Link } from "react-router-dom";
export default function ProductCard(props) {
  const item = props.item; //get the item value through the props (given by the item.jsx) props.item  = indha item enbadhu item.jsx il ulla left side il ulla props name not the name given in backend

  return (
    <div className="w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
      {/* Product Image */}
      <img
        src={item.image[0]} // can uplaod multiple images but in product card only shows the 1st image (image store as an array so 0 index of the aaray is shows in product card)
        alt={item.name}
        className="w-full h-44 object-contain bg-gray-100"
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h2>

        <p className="text-sm text-gray-500 mb-2">{item.category}</p>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

        <p className="text-xs text-gray-500 mb-4">Dimensions: {item.dimensions}</p>

        {/* Bottom section pinned */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-purple-600">LKR {item.price}</span>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                item.availability
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.availability ? "Available" : "Out of Stock"}
            </span>
          </div>

          <Link to={"/product/"+item.key}  //pass the product key to the productOverview page (in that page see the full details of the product)
            className="w-full h-10 inline-flex items-center justify-center rounded-lg bg-purple-600 text-white font-semibold text-sm no-underline hover:bg-purple-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}