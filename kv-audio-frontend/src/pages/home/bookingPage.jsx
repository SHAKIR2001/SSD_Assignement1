import { useState, useEffect } from "react";
import { loadCart, formatDate } from "../../utils/cart";
import BookingItems from "../../components/bookingItem";
import toast from "react-hot-toast";
import axios from "axios";

export default function BookingPage() {
  const [cart, setCart] = useState(loadCart()); //get thease from cart.jsx (browser storage)


  const [startingDate, setStartingDate] = useState(formatDate(new Date()));
  const [endingDate, setEndingDate] = useState(formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)));
  const [total , setTotal] = useState(0);
  const daysBetween = Math.max(
    (new Date(endingDate) - new Date(startingDate)) / (1000 * 60 * 60 * 24),
   1);

  const hasItems = Array.isArray(cart?.orderedItems) && cart.orderedItems.length > 0;

  function reloadCart() {
    setCart(loadCart());
    calculateTotal();
  }

  function calculateTotal(){
    const cartInfo = loadCart();

    if (!Array.isArray(cartInfo?.orderedItems) || cartInfo.orderedItems.length === 0) {
      setTotal(0);
      return;
    }

    cartInfo.startingDate = startingDate;
    cartInfo.endingDate = endingDate;
    cartInfo.days = daysBetween;

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`, cartInfo).then( (res)=>{
        console.log(res.data);
        setTotal(res.data.total)
    }).catch( (err)=>{
        console.error(err);
    })
  }

  useEffect( ()=>{
    calculateTotal();

  },[startingDate, endingDate])

  function handleBookingCreation() {
    const cart = loadCart();

    if (!Array.isArray(cart?.orderedItems) || cart.orderedItems.length === 0) {
      toast.error("Please add items to your cart before creating a booking");
      return;
    }

    cart.startingDate = startingDate;
    cart.endingDate = endingDate;
    cart.days = daysBetween; 

    const token = localStorage.getItem("token");
      if(token == null){
        window.location.href = "/login"
        return
      }
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, cart, {
        headers : {
            Authorization : `Bearer ${token}`
        }
   
    }).then( (res)=>{
        console.log(res.data);
        localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated")); 
        toast.success("Booking added")
        setCart(loadCart());
        
    }).catch( (err)=>{
        console.log(err);
        toast.error("Can not add Booking")
    })



  }

  return (
    <div className="w-full h-full flex flex-col i items-center">
      {/* keep your existing design */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-4 md:p-5 mt-3">
        <h2 className="text-lg font-bold text-gray-900">Booking Dates</h2>


        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Starting date
            </label>
            <input
              type="date"
              value={startingDate}
              onChange={(e) => {
                const nextStart = e.target.value;
                setStartingDate(nextStart);

                // small user-friendly clamp (prevents end < start)
                if (new Date(endingDate) < new Date(nextStart)) {
                  setEndingDate(nextStart);
                }
              }}
              className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Ending date
            </label>
            <input
              type="date"
              value={endingDate}
              onChange={(e) => {
                const nextEnd = e.target.value;

                // clamp to >= startingDate
                if (new Date(nextEnd) < new Date(startingDate)) {
                  setEndingDate(startingDate);
                } else {
                  setEndingDate(nextEnd);
                }
              }}
              className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Total days
            </label>
            <div className="h-10 rounded-lg bg-gray-100 px-3 flex items-center font-bold text-gray-900">
              {daysBetween} {daysBetween === 1 ? "day" : "days"}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mt-2">
        {cart.orderedItems.map((item) => {
          return (
            <BookingItems
              itemKey={item.key}
              key={item.key}
              quantity={item.quantity}
              refresh={reloadCart}
            />
          );
        })}
      </div>

      <div>
        <p className="w-full max-w-3xl mt-3 text-right text-lg font-bold text-gray-900">
          Total: <span className="text-purple-600">LKR {Number(total || 0).toFixed(2)}</span>
        </p>
      </div>


      <div className="w-full flex justify-center ">
        <button
          type="button"
          className="px-4 max-w-3xl mt-4 h-12 rounded-xl bg-purple-600 text-white font-bold shadow hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleBookingCreation}
          disabled={!hasItems}
        >
          Create Booking
        </button>
      </div>
    </div>
  );
}