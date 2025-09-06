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

// Sidebar Component
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
    } catch (err) {
      console.error("Failed to load conversation history", err);
    }
  };

  const handleNewChat = () => {
    if (typeof onNewChat === "function") {
      onNewChat();
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleConversations = () => setShowConversations(!showConversations);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-52"
      }  min-h-screen bg-[#e4e5e4] text-gray-800 flex flex-col border-r border-gray-300 transition-all duration-300`}
    >
      {/* Collapse Toggle & Profile */}
      <div className="relative flex flex-col px-3 py-4">
        <button
          onClick={toggleSidebar}
          className="absolute right-2 top-2 text-indigo-500 hover:text-indigo-700 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* User Profile */}
        <div
          className="flex items-center gap-2 px-1 cursor-pointer"
          onClick={toggleProfileMenu}
          title="User Menu"
        >
          <User className="w-7 h-7 text-indigo-600" />
          {!isCollapsed && (
            <span className="font-medium text-sm">Mudassir</span>
          )}
        </div>

        {/* Profile Dropdown */}
        {!isCollapsed && showProfileMenu && (
          <div className="mt-2 ml-1 flex flex-col gap-1 bg-white border border-gray-300 rounded-md shadow text-sm z-10 w-36">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={onSetting}
            >
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>Profile Settings</span>
            </div>
             <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 cursor-pointer"
              onClick={handleLogoutClick}
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-red-400">Logout</span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 px-2 text-sm font-medium mt-2">
        <div
          onClick={handleNewChat}
          className="flex items-center gap-3 hover:bg-cyan-500/20 px-3 py-2 rounded-md cursor-pointer transition"
          title="New Chat"
        >
          <Bot className="w-5 h-5 text-cyan-400" />
          {!isCollapsed && <span>New Chat</span>}
        </div>

        {/* Conversations */}
        <div>
          <div
            onClick={toggleConversations}
            className="flex items-center justify-between hover:bg-cyan-500/20 px-3 py-2 rounded-md cursor-pointer transition"
            title="Conversations"
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-cyan-400" />
              {!isCollapsed && <span>Conversations</span>}
            </div>
            {!isCollapsed && (
              <div className="text-cyan-400">
                {showConversations ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            )}
          </div>

          {!isCollapsed && showConversations && (
            <div className="ml-10 mt-1 flex flex-col gap-1 text-gray-300 text-sm max-h-60 overflow-y-auto">
              {conversationList.length === 0 ? (
                <div className="italic text-gray-500">No conversations</div>
              ) : (
                conversationList.map((conv) => (
                  <div
                    key={conv.session_id}
                    className="px-2 py-1 rounded hover:bg-cyan-500/10 cursor-pointer truncate transition"
                    title={conv.title}
                    onClick={() => handleConversationClick(conv.session_id)}
                  >
                    {conv.title || `Chat ${conv.session_id.slice(-4)}`}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div
          onClick={onSetting}
          className="flex items-center gap-3 hover:bg-cyan-500/20 px-3 py-2 rounded-md cursor-pointer transition"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-cyan-400" />
          {!isCollapsed && <span>Settings</span>}
        </div>

        <div
          onClick={onHelpClick}
          className="flex items-center gap-3 hover:bg-cyan-500/20 px-3 py-2 rounded-md cursor-pointer transition"
          title="Help Center"
        >
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          {!isCollapsed && <span>Help Center</span>}
        </div>
      </div>
    </div>
  );
}
