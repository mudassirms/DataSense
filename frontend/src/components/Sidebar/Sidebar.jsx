import {
  Bot,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  History,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchConversations, fetchConversationHistory } from "../../api";

export default function Sidebar({
  onNewChat,
  onHelpClick,
  onSetting,
  onLogout,
  onSessionSelect,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [conversationList, setConversationList] = useState([]);
  const [activeMenu, setActiveMenu] = useState("newChat");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [expandedConvId, setExpandedConvId] = useState(null);

  // Password reset states
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const conversations = await fetchConversations();
        setConversationList(conversations);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    loadConversations();
  }, []);

  const handleConversationClick = async (sessionId) => {
    try {
      const history = await fetchConversationHistory(sessionId);
      if (typeof onSessionSelect === "function") {
        onSessionSelect(sessionId, history.messages);
      }
      setActiveMenu("conversations");
    } catch (err) {
      console.error("Failed to load conversation history", err);
    }
  };

  const handleNewChat = (initialQuery = "") => {
    if (typeof onNewChat === "function") onNewChat(initialQuery);
    setActiveMenu("newChat");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    if (typeof onLogout === "function") onLogout();
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleConversations = () => setShowConversations(!showConversations);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleAdminMenu = () => setShowAdminMenu(!showAdminMenu);
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordReset = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setPasswordMessage("❗ Please fill in all fields.");
    }
    if (newPassword !== confirmPassword) {
      return setPasswordMessage("❌ New passwords do not match.");
    }
    setPasswordMessage("✅ Password reset successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordReset(false);
  };

  const activeColor = "bg-[#344955] text-white";
  const hoverColor = "hover:bg-[#50727B]/80";

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-44"
      } min-h-screen bg-[#e4e5e4] text-gray-800 flex flex-col border-r border-gray-300 transition-all duration-300`}
    >
      {/* User Profile */}
      <div className="relative flex flex-col px-3 py-4">
        <button
          onClick={toggleSidebar}
          className="absolute right-2 top-2 text-indigo-500 hover:text-indigo-700 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div
          className="flex items-center gap-2 px-1 cursor-pointer"
          onClick={toggleProfileMenu}
          title="User Menu"
        >
          <User className="w-7 h-7 text-indigo-600" />
          {!isCollapsed && <span className="font-medium text-sm">Mudassir</span>}
        </div>

        {!isCollapsed && showProfileMenu && (
          <div className="mt-2 ml-1 flex flex-col gap-1 bg-white border border-gray-300 rounded-md shadow text-sm z-10 w-44">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={() => {
                setShowPasswordReset(true);
              }}
            >
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>Reset Password</span>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 cursor-pointer"
              onClick={handleLogoutClick}
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-red-400">Logout</span>
            </div>

            {showPasswordReset && (
              <div className="p-3 bg-gray-50 rounded-md mt-1 flex flex-col gap-2">
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
                      value={passwordForm[field]}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePasswordReset}
                    className="flex-1 px-2 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowPasswordReset(false)}
                    className="flex-1 px-2 py-1 bg-gray-300 text-black rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
                {passwordMessage && (
                  <span className="text-xs text-gray-600">{passwordMessage}</span>
                )}
                <button
                  type="button"
                  className="text-xs text-indigo-500 underline mt-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide Passwords" : "Show Passwords"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Menus */}
      <div className="flex flex-col gap-2 px-2 text-sm font-medium mt-2">
        {/* New Chat */}
        <div
          onClick={() => handleNewChat()}
          className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition 
            ${activeMenu === "newChat" ? activeColor : hoverColor}`}
          title="New Chat"
        >
          <Bot className="w-5 h-5 text-cyan-400" />
          {!isCollapsed && <span>New Chat</span>}
        </div>

        {/* Conversations */}
        <div>
          <div
            onClick={() => {
              toggleConversations();
              setActiveMenu("conversations");
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition 
              ${activeMenu === "conversations" ? activeColor : hoverColor}`}
            title="Conversations"
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-cyan-400" />
              {!isCollapsed && <span>Chats</span>}
            </div>
            {!isCollapsed && (
              <div className="text-cyan-400">
                {showConversations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            )}
          </div>

          {!isCollapsed && showConversations && (
            <div className="ml-2 mt-2 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <div className="ml-2 flex flex-col gap-1 text-gray-700 text-sm max-h-60 overflow-y-auto pr-1">
                {conversationList.length === 0 ? (
                  <div className="italic text-gray-500">No conversations</div>
                ) : (
                  conversationList
                    .filter((conv) =>
                      conv.title?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((conv) => (
                      <div key={conv.session_id} className="mb-1">
                        <div
                          className="px-2 py-1 rounded hover:bg-cyan-500/10 cursor-pointer flex justify-between items-center"
                          onClick={() =>
                            setExpandedConvId(
                              expandedConvId === conv.session_id ? null : conv.session_id
                            )
                          }
                        >
                          <span className="truncate">
                            {conv.title || `Chat ${conv.session_id.slice(-4)}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              className={`text-xs ${
                                favorites.includes(conv.session_id)
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFavorites((prev) =>
                                  prev.includes(conv.session_id)
                                    ? prev.filter((id) => id !== conv.session_id)
                                    : [...prev, conv.session_id]
                                );
                              }}
                            >
                              📌
                            </button>
                            {expandedConvId === conv.session_id ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div
          onClick={() => {
            onSetting();
            setActiveMenu("settings");
          }}
          className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition 
            ${activeMenu === "settings" ? activeColor : hoverColor}`}
          title="Settings"
        >
          <Settings className="w-5 h-5 text-cyan-400" />
          {!isCollapsed && <span>Settings</span>}
        </div>

        {/* Help */}
        <div
          onClick={() => {
            onHelpClick();
            setActiveMenu("help");
          }}
          className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition 
            ${activeMenu === "help" ? activeColor : hoverColor}`}
          title="Help Center"
        >
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          {!isCollapsed && <span>Help Center</span>}
        </div>

        {/* Admin Menu */}
        <div>
          <div
            onClick={toggleAdminMenu}
            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition 
              ${activeMenu === "admin" ? activeColor : hoverColor}`}
            title="Admin"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-red-400" />
              {!isCollapsed && <span>Admin</span>}
            </div>
            {!isCollapsed && (
              <div className="text-red-400">
                {showAdminMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            )}
          </div>

          {!isCollapsed && showAdminMenu && (
            <div className="ml-4 flex flex-col gap-1 text-gray-700 text-sm">
              <div
                className="px-2 py-1 rounded hover:bg-red-100 cursor-pointer"
                onClick={() => {
                  onSetting("admin_users");
                  setActiveMenu("admin");
                }}
              >
                User Management
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
