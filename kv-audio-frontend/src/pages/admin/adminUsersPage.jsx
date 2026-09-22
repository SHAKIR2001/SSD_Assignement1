import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      const token = localStorage.getItem("token");
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [loading]);

  function handleBlockUser(email) {
    const token = localStorage.getItem("token");

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/block/${email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setLoading(true); // re-fetch list (keeps your existing flow)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                Users
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                All registered users
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-50 ring-1 ring-gray-200 text-sm text-gray-700">
                Total:{" "}
                <span className="ml-2 font-bold text-gray-900">
                  {users?.length || 0}
                </span>
              </span>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="mt-6 p-4 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-sm text-gray-600">
              Loading users...
            </div>
          )}

          {/* Empty state */}
          {!loading && (!users || users.length === 0) && (
            <div className="mt-6 p-8 rounded-xl bg-gray-50 ring-1 ring-gray-100 text-center">
              <div className="text-sm font-semibold text-gray-800">
                No users found
              </div>
              <div className="text-xs text-gray-500 mt-1">
                When users register, they will appear here.
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && users && users.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Phone</th>
                      <th className="px-5 py-4">Address</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => {
                      const fullName =
                        `${u?.firstName || ""} ${u?.lastName || ""}`.trim() ||
                        "Unnamed";

                      const initials =
                        `${(u?.firstName || "U")[0] || "U"}${
                          (u?.lastName || "S")[0] || "S"
                        }`.toUpperCase();

                      const role = (u?.role || "unknown").toLowerCase();
                      const roleBadge =
                        role === "admin"
                          ? "bg-red-50 text-red-700 ring-red-200"
                          : role === "customer"
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-gray-50 text-gray-700 ring-gray-200";

                      return (
                        <tr
                          key={u?._id}
                          className="hover:bg-gray-50/60 transition"
                        >
                          {/* User */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center shrink-0">
                                {u?.profilePicture ? (
                                  <img
                                    src={u.profilePicture}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="text-xs font-extrabold text-gray-600">
                                    {initials}
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 truncate max-w-[260px]">
                                  {fullName}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-[260px]">
                                  {u?.email || "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {u?.email || "—"}
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-extrabold rounded-full ring-1 ${roleBadge}`}
                            >
                              {u?.role || "unknown"}
                            </span>
                          </td>

                          {/* Phone */}
                          <td className="px-5 py-4 text-sm text-gray-700">
                            {u?.phone || "—"}
                          </td>

                          {/* Address */}
                          <td className="px-5 py-4 text-sm text-gray-700">
                            <span className="block max-w-[420px] truncate">
                              {u?.address || "—"}
                            </span>
                          </td>

                          {/* Status (click to toggle) */}
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => handleBlockUser(u?.email)}
                              className={[
                                "inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-extrabold ring-1",
                                "transition active:scale-[0.98]",
                                u?.isBlocked
                                  ? "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100"
                                  : "bg-green-50 text-green-700 ring-green-200 hover:bg-green-100",
                              ].join(" ")}
                              title="Click to block/unblock"
                            >
                              {u?.isBlocked ? "BLOCKED" : "ACTIVE"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}