import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatInterface from "./components/Chat/ChatInterface";
import HelpCenter from "./components/Chat/helpcenter";
import SettingsPage from "./components/Chat/SettingsPage";
import Login from "./components/Auth/Login";
import logo from "./assets/logo_4.png";
import favicon from "./assets/datasense.png";
import DomainSelector from "./components/Chat/DomainSelector";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [activeView, setActiveView] = useState("chat"); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null); 

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView("chat");
    setMessages([]);
    setSelectedSessionId(null);
    setSelectedDomain(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  };

  const handleSessionSelect = (sessionId, conversationMessages) => {
    setSelectedSessionId(sessionId);
    setMessages(conversationMessages);
    setActiveView("chat");
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedSessionId(null);
    setActiveView("chat");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#e4e5e4] text-white overflow-hidden">
      {/* Header */}
         <header className="w-full h-20 flex items-center justify-between px-6 bg-[#e4e5e4] border-b border-gray-300">

  <div className="flex items-center gap-4">
    <img
      src={favicon}
      alt="favicon"
      className="h-14 w-14 object-contain rounded-lg"
    />
    <div className="text-xl font-bold tracking-wide flex gap-1 items-center">
      <span className="text-black">MaverickAI</span>
            <span className="bg-gradient-to-r from-fuchsia-600 via-violet-700 to-blue-600 text-transparent bg-clip-text">
        DataSense
      </span>
    </div>
  </div>

  <div className="h-full flex items-center">
    <DomainSelector
      selectedDomain={selectedDomain}
      onDomainChange={setSelectedDomain}
    />
  </div>
</header>


      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onNewChat={handleNewChat}
          onHelpClick={() => setActiveView("help")}
          onSetting={() => setActiveView("settings")}
          onLogout={handleLogout}
          onSessionSelect={handleSessionSelect}
        />

        <div className="flex flex-col flex-1 bg-white text-black rounded-t-2xl shadow-lg overflow-hidden">
          <main className="flex-1 overflow-hidden">
            {activeView === "chat" && (
              <ChatInterface
                messages={messages}
                setMessages={setMessages}
                onLogout={handleLogout}
                sessionId={selectedSessionId}
                selectedDomain={selectedDomain}
              />
            )}
            {activeView === "help" && <HelpCenter />}
            {activeView === "settings" && <SettingsPage />}
          </main>

          <footer className="text-xs text-center text-gray-400 py-3 bg-white">
            &copy; 2025 DataSense • Empowering AI Conversations
          </footer>
        </div>
      </div>
    </div>
  );
}
