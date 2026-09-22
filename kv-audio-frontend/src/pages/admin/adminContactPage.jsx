import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function AdminContactPage() {
    const [messages, setMessages] = useState([]);
    const [state, setState] = useState("loading"); // loading | success | error
    const [activeMessage, setActiveMessage] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all"); // all | resolved | unresolved

    async function fetchMessages() {
        const token = localStorage.getItem("token");
        if (!token) {
            setState("error");
            toast.error("Not authorized. Please login again.");
            return;
        }

        try {
            setState("loading");
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.messages)
                    ? res.data.messages
                    : [];

            setMessages(list);
            setState("success");
        } catch (err) {
            console.error(err);
            setState("error");
            toast.error(err?.response?.data?.error || err?.response?.data?.message || "Failed to load messages");
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        if (!modalOpened) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setModalOpened(false);
                setActiveMessage(null);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [modalOpened]);

    const visibleMessages = useMemo(() => {
        let list = Array.isArray(messages) ? [...messages] : [];

        if (statusFilter === "resolved") {
            list = list.filter((m) => m?.isResolved === true);
        } else if (statusFilter === "unresolved") {
            list = list.filter((m) => m?.isResolved !== true);
        }

        list.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
        return list;
    }, [messages, statusFilter]);

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

    function openMessage(m) {
        setActiveMessage(m);
        setModalOpened(true);
    }

    function closeModal() {
        setModalOpened(false);
        setActiveMessage(null);
    }

    async function resolveMessage(m) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Not authorized. Please login again.");
            return;
        }

        const contactId = m?.id;
        if (contactId === undefined || contactId === null || contactId === "") {
            toast.error("Missing message id");
            return;
        }

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/contact/${encodeURIComponent(String(contactId))}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updated = res?.data?.message ?? res?.data;

            setMessages((prev) =>
                (Array.isArray(prev) ? prev : []).map((x) => {
                    const same = (x?._id && x._id === m?._id) || (x?.id != null && x.id === m?.id);
                    if (!same) return x;
                    if (updated && (updated?._id || updated?.id != null)) return updated;
                    return { ...x, isResolved: true };
                })
            );

            if (activeMessage && ((activeMessage?._id && activeMessage._id === m?._id) || (activeMessage?.id != null && activeMessage.id === m?.id))) {
                setActiveMessage((p) => ({ ...(p || {}), isResolved: true }));
            }

            toast.success("Marked as resolved");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || err?.response?.data?.message || "Failed to resolve");
        }
    }

    return (
        <div className="w-full p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Messages</h1>
                            <p className="text-sm text-gray-500 mt-1">Customer contact submissions</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 px-3 rounded-xl bg-white ring-1 ring-gray-200 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
                                aria-label="Filter messages by status"
                            >
                                <option value="all">All</option>
                                <option value="unresolved">Unresolved</option>
                                <option value="resolved">Resolved</option>
                            </select>

                            <button
                                type="button"
                                onClick={fetchMessages}
                                className="h-10 px-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition cursor-pointer"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {state === "loading" && (
                        <div className="mt-6 p-4 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-sm text-gray-600 flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
                            Loading messages...
                        </div>
                    )}

                    {state === "error" && (
                        <div className="mt-6 p-5 rounded-xl bg-red-50 ring-1 ring-red-100">
                            <div className="text-sm font-bold text-red-700">Could not load messages</div>
                            <div className="text-xs text-red-600 mt-1">Check backend endpoint and admin token.</div>
                        </div>
                    )}

                    {state === "success" && messages.length === 0 && (
                        <div className="mt-6 p-8 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-center">
                            <div className="text-sm font-semibold text-gray-800">No messages yet</div>
                            <div className="text-xs text-gray-500 mt-1">When customers use the contact form, messages appear here.</div>
                        </div>
                    )}

                    {state === "success" && messages.length > 0 && visibleMessages.length === 0 && (
                        <div className="mt-6 p-8 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-center">
                            <div className="text-sm font-semibold text-gray-800">No messages found</div>
                            <div className="text-xs text-gray-500 mt-1">Try changing the status filter.</div>
                        </div>
                    )}

                    {state === "success" && visibleMessages.length > 0 && (
                        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-[980px] w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-gray-500">
                                            <th className="px-5 py-4">Name</th>
                                            <th className="px-5 py-4">Email</th>
                                            <th className="px-5 py-4">Phone</th>
                                            <th className="px-5 py-4">Subject</th>
                                            <th className="px-5 py-4">Status</th>
                                            <th className="px-5 py-4">Received</th>
                                            <th className="px-5 py-4 text-right">Resolve</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {visibleMessages.map((m) => (
                                            <tr
                                                key={m?._id || `${m?.email || ""}-${m?.createdAt || ""}`}
                                                className="hover:bg-gray-50/60 transition cursor-pointer"
                                                onClick={() => openMessage(m)}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-bold text-gray-900 truncate max-w-[220px]">{m?.name || "—"}</div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-700">
                                                    <span className="truncate block max-w-[260px]">{m?.email || "—"}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-700">{m?.phone || "—"}</td>
                                                <td className="px-5 py-4">
                                                    <div className="text-sm font-semibold text-gray-900 truncate max-w-[320px]">{m?.subject || "—"}</div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={[
                                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ring-1",
                                                            m?.isResolved ? "bg-green-50 text-green-700 ring-green-200" : "bg-yellow-50 text-yellow-700 ring-yellow-200",
                                                        ].join(" ")}
                                                    >
                                                        {m?.isResolved ? "Resolved" : "Unresolved"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-700">{formatDateTime(m?.createdAt)}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        className={[
                                                            "h-9 px-3 rounded-xl text-white text-sm font-semibold transition",
                                                            m?.isResolved ? "bg-gray-300 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 cursor-pointer",
                                                        ].join(" ")}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (m?.isResolved) return;
                                                            resolveMessage(m);
                                                        }}
                                                        disabled={!!m?.isResolved}
                                                    >
                                                        {m?.isResolved ? "Resolved" : "Resolve"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modalOpened && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50" onClick={closeModal}>
                    <div
                        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Message details"
                    >
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-gray-900">Message</h2>
                                <div className="text-xs text-gray-500 mt-1">{formatDateTime(activeMessage?.createdAt)}</div>
                            </div>

                            <IoMdCloseCircleOutline className="text-3xl cursor-pointer hover:text-red-600" onClick={closeModal} />
                        </div>

                        <div className="p-5 max-h-[75vh] overflow-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                <div className="text-sm">
                                    <span className="font-extrabold text-gray-800">Status:</span>{" "}
                                    <span className={["font-extrabold", activeMessage?.isResolved ? "text-green-700" : "text-yellow-700"].join(" ")}
                                    >
                                        {activeMessage?.isResolved ? "Resolved" : "Unresolved"}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-extrabold text-gray-800">Name:</span>{" "}
                                    <span className="text-gray-700 font-semibold">{activeMessage?.name || "—"}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-extrabold text-gray-800">Email:</span>{" "}
                                    <span className="text-gray-700 font-semibold">{activeMessage?.email || "—"}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-extrabold text-gray-800">Phone:</span>{" "}
                                    <span className="text-gray-700 font-semibold">{activeMessage?.phone || "—"}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-extrabold text-gray-800">Subject:</span>{" "}
                                    <span className="text-gray-700 font-semibold">{activeMessage?.subject || "—"}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-extrabold text-gray-900">Message</h3>
                                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{activeMessage?.message || "—"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}