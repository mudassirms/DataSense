import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const { currentPassword, newPassword, confirmPassword } = form;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setMessage("❗ Please fill in all fields.");
    }
    if (newPassword !== confirmPassword) {
      return setMessage("❌ New passwords do not match.");
    }
    setMessage("✅ Password reset successfully!");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="w-full h-full px-6 py-8 bg-[#f4f5f7] text-gray-800 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 max-w-2xl mx-auto">
        {/* Password Reset */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            🔒 Reset Password
          </h2>
          <div className="space-y-4">
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name={field}
                  placeholder={
                    field === "currentPassword"
                      ? "Current Password"
                      : field === "newPassword"
                      ? "New Password"
                      : "Confirm New Password"
                  }
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  onClick={togglePassword}
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            ))}
            <button
              onClick={handleReset}
              className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Reset Password
            </button>
            {message && (
              <p className="text-sm text-center text-gray-600 mt-2">{message}</p>
            )}
          </div>
        </div>

        {/* Data & Privacy Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            🧹 Data & Privacy
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Your data is private and never shared with third parties.</li>
            <li>You can delete your chat history anytime.</li>
          </ul>
          <button
            onClick={() => alert("History deleted (placeholder)")}
            className="mt-4 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete All History
          </button>
        </div>
      </div>
    </div>
  );
}
