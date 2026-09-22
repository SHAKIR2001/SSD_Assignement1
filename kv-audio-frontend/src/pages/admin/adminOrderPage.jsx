import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading"); // loading | success | error
  const [activeOrder, setActiveOrder] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  // UI controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | approved | rejected
  const [sortBy, setSortBy] = useState("orderDateDesc"); // orderDateDesc | orderDateAsc | totalDesc | totalAsc

  async function fetchOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
      setState("error");
      toast.error("Not authorized. Please login again.");
      return;
    }

    try {
      setState("loading");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend returns an array for customers, but for admin it returns: { orders: [...] }
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.orders) ? res.data.orders : [];
      setOrders(list);
      setState("success");
    } catch (err) {
      console.error(err);
      setState("error");
      toast.error(err?.response?.data?.error || "Failed to load orders");
    }
  }

  useEffect(() => {
    fetchOrders();
    
  }, []);

  useEffect(() => {
    if (!modalOpened) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpened(false);
        setActiveOrder(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpened]);

  function formatDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDateOnly(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  function formatMoney(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
  }

  function closeModal() {
    setModalOpened(false);
    setActiveOrder(null);
  }

  function normalizeStatus(value) {
    const s = String(value || "").trim();
    return s || "Pending";
  }

  function statusTone(status) {
    const s = normalizeStatus(status).toLowerCase();
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    return "pending";
  }

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = Array.isArray(orders) ? [...orders] : [];

    // filter: status (string)
    if (statusFilter !== "all") {
      list = list.filter((o) => normalizeStatus(o?.status).toLowerCase() === statusFilter);
    }

    // filter: search by orderId/email
    if (q) {
      list = list.filter((o) => {
        const orderId = String(o?.orderId || "").toLowerCase();
        const email = String(o?.email || "").toLowerCase();
        return orderId.includes(q) || email.includes(q);
      });
    }

    // sort
    const toTime = (v) => {
      const t = new Date(v).getTime();
      return Number.isNaN(t) ? 0 : t;
    };
    const toNum = (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };

    if (sortBy === "orderDateAsc") {
      list.sort((a, b) => toTime(a?.orderDate) - toTime(b?.orderDate));
    } else if (sortBy === "orderDateDesc") {
      list.sort((a, b) => toTime(b?.orderDate) - toTime(a?.orderDate));
    } else if (sortBy === "totalAsc") {
      list.sort((a, b) => toNum(a?.totalAmount) - toNum(b?.totalAmount));
    } else if (sortBy === "totalDesc") {
      list.sort((a, b) => toNum(b?.totalAmount) - toNum(a?.totalAmount));
    }

    return list;
  }, [orders, search, sortBy, statusFilter]);


  function handleOrderStatusChange(orderId, status) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authorized. Please login again.");
      return;
    }

    if (!orderId) {
      toast.error("Order id missing");
      return;
    }
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/status/${orderId}`,
        { status: normalizeStatus(status) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Order status updated");
        closeModal();
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to update order status"
        );
      });
  }
  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Orders</h1>
    
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-50 ring-1 ring-gray-200 text-sm text-gray-700">
                Total: <span className="ml-2 font-bold text-gray-900">{orders?.length || 0}</span>
              </span>

              <button
                type="button"
                onClick={fetchOrders}
                className="h-10 px-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-gray-600 mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID or Email..."
                className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="orderDateDesc">Newest first</option>
                <option value="orderDateAsc">Oldest first</option>
                <option value="totalDesc">Total (high → low)</option>
                <option value="totalAsc">Total (low → high)</option>
              </select>
            </div>
          </div>

          {/* States */}
          {state === "loading" && (
            <div className="mt-6 p-4 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-sm text-gray-600 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
              Loading orders...
            </div>
          )}

          {state === "error" && (
            <div className="mt-6 p-5 rounded-xl bg-red-50 ring-1 ring-red-100">
              <div className="text-sm font-bold text-red-700">Could not load orders</div>
              <div className="text-xs text-red-600 mt-1">
                Check your backend, token, and <code className="font-semibold">VITE_BACKEND_URL</code>.
              </div>
            </div>
          )}

          {state === "success" && filteredAndSorted.length === 0 && (
            <div className="mt-6 p-8 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-center">
              <div className="text-sm font-semibold text-gray-800">No orders found</div>
              <div className="text-xs text-gray-500 mt-1">
                Try clearing filters or changing the search.
              </div>
            </div>
          )}

          {/* Table */}
          {state === "success" && filteredAndSorted.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">Order ID</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Days</th>
                      <th className="px-5 py-4">Start</th>
                      <th className="px-5 py-4">End</th>
                      <th className="px-5 py-4">Total (LKR)</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Ordered On</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredAndSorted.map((o) => {
                      const total = Number(o?.totalAmount ?? 0);
                      const status = normalizeStatus(o?.status);
                      const tone = statusTone(status);

                      return (
                        <tr
                          key={o?._id || o?.orderId}
                          className="hover:bg-gray-50/60 transition cursor-pointer"
                          onClick={() => {
                            setActiveOrder(o);
                            setModalOpened(true);
                          }}
                        >
                          <td className="px-5 py-4">
                            <div className="font-extrabold text-gray-900">{o?.orderId || "—"}</div>
                            
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            <span className="font-semibold">{o?.email || "—"}</span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            <span className="font-bold">{Number(o?.days ?? 0) || 0}</span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">{formatDateOnly(o?.startingDate)}</td>

                          <td className="px-5 py-4 text-sm text-gray-700">{formatDateOnly(o?.endingDate)}</td>

                          <td className="px-5 py-4">
                            <span className="font-extrabold text-purple-700">
                              {total.toFixed(2)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={[
                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ring-1",
                                tone === "approved"
                                  ? "bg-green-50 text-green-700 ring-green-200"
                                  : tone === "rejected"
                                    ? "bg-red-50 text-red-700 ring-red-200"
                                    : "bg-yellow-50 text-yellow-700 ring-yellow-200",
                              ].join(" ")}
                            >
                              {status.toUpperCase()}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {formatDateTime(o?.orderDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>


            </div>
          )}
          {
            modalOpened  && (
                <div
                  className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50 "
                  onClick={closeModal}
                >
                  <div
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Order Details"
                  >
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-extrabold text-gray-900">Order Details</h2>
                      </div>

                        <IoMdCloseCircleOutline className="text-3xl cursor-pointer hover:text-red-600" onClick={closeModal}/>
                    </div>

                    <div className="p-5 max-h-[75vh] overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Order ID:</span>{" "}
                          <span className="text-gray-700 font-semibold">{activeOrder?.orderId || "—"}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Email:</span>{" "}
                          <span className="text-gray-700 font-semibold">{activeOrder?.email || "—"}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Days:</span>{" "}
                          <span className="text-gray-700 font-semibold">{Number(activeOrder?.days ?? 0) || 0}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Approval Status:</span>{" "}
                          <span
                            className={[
                              "font-extrabold",
                              statusTone(activeOrder?.status) === "approved"
                                ? "text-green-700"
                                : statusTone(activeOrder?.status) === "rejected"
                                  ? "text-red-700"
                                  : "text-yellow-700",
                            ].join(" ")}
                          >
                            {normalizeStatus(activeOrder?.status)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Starting Date:</span>{" "}
                          <span className="text-gray-700 font-semibold">{formatDateOnly(activeOrder?.startingDate)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Ending Date:</span>{" "}
                          <span className="text-gray-700 font-semibold">{formatDateOnly(activeOrder?.endingDate)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Total Amount:</span>{" "}
                          <span className="text-purple-700 font-extrabold">{formatMoney(activeOrder?.totalAmount)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-extrabold text-gray-800">Order Date:</span>{" "}
                          <span className="text-gray-700 font-semibold">{formatDateOnly(activeOrder?.orderDate)}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold text-gray-900">Items</h3>
                          <span className="text-xs text-gray-500">
                            {Array.isArray(activeOrder?.orderedItems) ? activeOrder.orderedItems.length : 0} item(s)
                          </span>
                        </div>

                        <div className="mt-3 rounded-2xl ring-1 ring-gray-100 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-[600px] w-full bg-white">
                              <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-gray-500">
                                  <th className="px-4 py-3">Product</th>
                                  <th className="px-4 py-3">Qty</th>
                                  <th className="px-4 py-3">Price (LKR)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {(Array.isArray(activeOrder?.orderedItems) ? activeOrder.orderedItems : []).map((it) => {
                                  const name = it?.product?.name || "—";
                                  const image = it?.product?.image;
                                  const price = it?.product?.price ?? 0;
                                  const qty = Number(it?.quantity ?? 0) || 0;

                                  return (
                                    <tr key={it?._id || name} className="hover:bg-gray-50/60 transition">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-xl ring-1 ring-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                                            {image ? (
                                              <img
                                                src={image}
                                                alt={name}
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <span className="text-xs font-bold text-gray-400">No image</span>
                                            )}
                                          </div>
                                          <div>
                                            <div className="text-sm font-extrabold text-gray-900">{name}</div>
                                            <div className="text-xs text-gray-500">{it?.product?.key || ""}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700 font-bold">{qty}</td>
                                      <td className="px-4 py-3 text-sm font-extrabold text-gray-900">{formatMoney(price)}</td>
                                    </tr>
                                  );
                                })}

                                {(!Array.isArray(activeOrder?.orderedItems) || activeOrder.orderedItems.length === 0) && (
                                  <tr>
                                    <td className="px-4 py-6 text-sm text-gray-500" colSpan={3}>
                                      No items in this order.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <button
                          type="button"
                          className="h-10 px-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
                          onClick={() => {
                            handleOrderStatusChange(activeOrder?.orderId || activeOrder?._id, "Approved");
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="h-10 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
                          onClick={() => {
                            handleOrderStatusChange(activeOrder?.orderId || activeOrder?._id, "Rejected");
                          }}
                        >
                          Reject
                        </button>


                      </div>
                    </div>
                  </div>
                </div>
            )
          }
        </div>
      </div>
    </div>
  );
}