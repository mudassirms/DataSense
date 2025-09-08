import { useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([
    { id: 1, name: "Mudassir", email: "mudassir@example.com", role: "Admin", domains: ["Healthcare", "Finance"] },
    { id: 2, name: "John Doe", email: "john@example.com", role: "User", domains: ["School"] },
  ]);

  const [logs] = useState([
    { id: 1, user: "Mudassir", query: "Show me stock prices", timestamp: "2025-09-08 10:30" },
    { id: 2, user: "John Doe", query: "Get school attendance", timestamp: "2025-09-08 10:35" },
  ]);

  return (
    <div className="w-full h-full px-6 py-8 bg-[#f4f5f7] text-gray-800 overflow-y-auto max-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Admin Panel</h1>

      {/* User Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">👥 User Management</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Domains</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.domains.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">📜 Audit Logs</h2>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Query</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2">{log.user}</td>
                  <td className="px-4 py-2">{log.query}</td>
                  <td className="px-4 py-2">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
