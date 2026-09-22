import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { addToCart, removeFromCart } from "../utils/cart";
import { Link } from "react-router-dom";

export default function BookingItems(props) {
  const { itemKey, quantity, refresh } = props;

  const [item, setItem] = useState(null);
  const [state, setState] = useState("loading"); // loading | success | error
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setState("loading");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${itemKey}`
        );

        if (cancelled) return;
        setItem(res.data);
        setState("success");
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setState("error");

        try {
          removeFromCart(itemKey);
        } finally {
          refresh?.();
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [itemKey, refresh]);

  const imageUrl = useMemo(() => {
    const arr = Array.isArray(item?.image) ? item.image : [];
    return arr[0] || "/logo.png";
  }, [item]);

  const price = useMemo(() => Number(item?.price ?? 0), [item?.price]);

  const lineTotal = useMemo(() => {
    const qty = Number(quantity ?? 0);
    return price * qty;
  }, [price, quantity]);

  function onRemove() {
    if (removing) return;
    setRemoving(true);
    try {
      removeFromCart(itemKey);
    } finally {
      refresh?.();
      setRemoving(false);
    }
  }

  function onPlus() {
    if (removing) return;
    addToCart(itemKey, 1);
    refresh?.();
  }

  function onMinus() {
    if (removing) return;

    const qty = Number(quantity ?? 0);

    if (qty <= 1) {
      removeFromCart(itemKey);
      refresh?.();
      return;
    }

    addToCart(itemKey, -1);
    refresh?.();
  }

  if (state === "loading") {
    return (
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-4 md:p-5 flex gap-4 animate-pulse">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-xl" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="mt-2 h-3 bg-gray-200 rounded w-1/3" />
          <div className="mt-4 h-3 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="w-28 h-9 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-4 md:p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Item unavailable</p>
          <p className="text-xs text-gray-600 mt-0.5">Key: {itemKey}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="h-9 px-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center m-1">
      {/* Image */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <img
          src={imageUrl}
          alt={item?.name || itemKey}
          className="w-24 h-24 md:w-28 md:h-28 object-contain bg-gray-100 rounded-xl"
        />
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
              {item?.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Key: {itemKey}</p>
          </div>

          <div className="shrink-0 flex gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {item?.category || "other"}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-500">Price</p>
            <p className="font-bold text-purple-600">LKR {price.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500">Qty</p>

            {/* Simple + / - */}
            <div className="mt-1 inline-flex items-center rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={onMinus}
                disabled={removing || Number(quantity ?? 0) <= 0}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 transition font-bold"
              >
                -
              </button>

              <div className="w-12 h-9 inline-flex items-center justify-center font-semibold text-gray-900">
                {quantity}
              </div>

              <button
                type="button"
                onClick={onPlus}
                disabled={removing}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 transition font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500">Line total</p>
            <p className="font-bold text-gray-900">LKR {lineTotal.toFixed(2)}</p>
          </div>

          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-500">Dimensions</p>
            <p className="font-semibold text-gray-900 truncate">
              {item?.dimensions || "-"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/product/${itemKey}`}
            className="h-9 px-3 inline-flex items-center justify-center rounded-lg bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300 transition no-underline"
          >
            View
          </Link>

          <button
            type="button"
            onClick={onRemove}
            disabled={removing}
            className="h-9 px-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}