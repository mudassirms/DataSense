import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../../assets/datasense.png";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      onLogin();
      navigate("/");
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      if (onLogin) onLogin();
      navigate("/");
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050d1b] text-gray-200 px-4 font-[Inter] relative overflow-hidden">
      <div className="absolute top-6 left-6 md:left-12 text-2xl font-bold tracking-tight z-10 flex items-center gap-2">
        <span className="text-gray-100">MaverickAI</span>
        <span className="bg-gradient-to-r from-cyan-300 via-green-300 to-teal-400 text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(0,255,200,0.6)]">
          DataSense
        </span>
      </div>

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-[160px]" />

      <div className="w-full max-w-md z-10 bg-[#0a152b]/90 rounded-2xl shadow-xl border border-cyan-500/20 p-10 backdrop-blur-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-28 w-auto drop-shadow-[0_0_15px_rgba(0,255,200,0.5)]" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-cyan-400 to-teal-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400/60" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              className="pl-11 w-full pt-5 pb-2 rounded-xl bg-[#0f1f3a] border border-cyan-500/30 text-sm text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 peer"
            />
            <label
              htmlFor="email"
              className="absolute left-11 top-2 text-sm text-gray-400 transition-all duration-200 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-400"
            >
              Email address
            </label>
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400/60" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              className="pl-11 w-full pt-5 pb-2 rounded-xl bg-[#0f1f3a] border border-cyan-500/30 text-sm text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 peer"
            />
            <label
              htmlFor="password"
              className="absolute left-11 top-2 text-sm text-gray-400 transition-all duration-200 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-400"
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-teal-500 hover:opacity-90 text-white font-semibold rounded-xl 
                      transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <span className="text-cyan-400 hover:underline hover:text-cyan-300 cursor-pointer font-medium">
            Sign up
          </span>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-center text-gray-500">
          &copy; 2025 DataSense • Empowering AI Conversations
        </div>
      </div>
    </div>
  );
}
