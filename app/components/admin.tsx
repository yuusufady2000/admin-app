
import { useEffect, useState } from "react";
import type { User } from "../../typ";
import { Link } from "react-router";

const Admin = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://admin-app-1-se24.onrender.com/User");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const searchUser = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = searchUser.filter((user) => {
    if (filters === "all") {
      return true;
    }

    return user.status === filters;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Admin Panel
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor your registered users.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-96">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search seller by name..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-11 text-sm font-medium text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition hover:text-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              {search.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Search results
                    </p>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {searchUser.length > 0 ? (
                      searchUser.map((user) => (
                        <Link
                          key={user.id}
                          to={`/detailView/${user.id}`}
                          onClick={() => setSearch("")}
                          className="flex items-center gap-3 border-b border-gray-50 px-4 py-4 transition last:border-b-0 hover:bg-blue-50"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {user.name}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                              user.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : user.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.status || "pending"}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                            />
                          </svg>
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-900">
                          No seller found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Try searching with another name.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={fetchUsers}
              className="rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Refresh Users
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {users.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                👥
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <button
            onClick={() => setFilters("all")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filters === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilters("pending")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filters === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilters("accepted")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filters === "accepted"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Accepted
          </button>

          <button
            onClick={() => setFilters("rejected")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filters === "rejected"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Rejected
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-gray-600">
                        #{user.id}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>

                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            user.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : user.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.status || "pending"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          to={`/detailView/${user.id}`}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="text-4xl">👤</div>

                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        No users match the selected filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

