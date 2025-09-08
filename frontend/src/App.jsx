import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatInterface from "./components/Chat/ChatInterface";
import HelpCenter from "./components/Chat/helpcenter";
import SettingsPage from "./components/Chat/SettingsPage";
import Login from "./components/Auth/Login";
import favicon from "./assets/datasense.png";
import DomainSelector from "./components/Chat/DomainSelector";
import AdminPanel from "./components/Chat/AdminPanel";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [activeView, setActiveView] = useState("chat");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const [domains, setDomains] = useState([
    "Healthcare",
    "Stock",
    "School",
    "Retail",
    "Finance",
  ]);

  const [schemas, setSchemas] = useState({
    Healthcare: "",
    Stock: "",
    School: "",
    Retail: "",
    Finance: "",
  });

  const [selectedDomain, setSelectedDomain] = useState("Healthcare");
  const [selectedLLM, setSelectedLLM] = useState("GPT-4");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) setIsAuthenticated(true);
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
    setSelectedDomain("Healthcare");
    setSelectedLLM("GPT-4");
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

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#e4e5e4] text-white overflow-hidden">
      {/* Header */}
      <header className="w-full h-12 flex items-center justify-between px-6 bg-[#e4e5e4] border-b border-gray-300">
        <div className="flex items-center gap-1">
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

        <div className="h-full flex items-center gap-4">
          {/* Domain Selector */}
          <DomainSelector
            selectedDomain={selectedDomain}
            onDomainChange={setSelectedDomain}
            domains={domains}
          />
          <div className="text-sm text-gray-800 bg-white px-3 py-1 rounded-md">
            LLM: {selectedLLM}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onNewChat={handleNewChat}
          onHelpClick={() => setActiveView("help")}
          onSetting={(view = "settings") => setActiveView(view)}
          onLogout={handleLogout}
          onSessionSelect={handleSessionSelect}
        />

        <div className="flex flex-col flex-1 bg-white text-black rounded-t-2xl shadow-lg overflow-hidden">
          {/* Main content area */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {activeView === "chat" && (
              <ChatInterface
                messages={messages}
                setMessages={setMessages}
                onLogout={handleLogout}
                sessionId={selectedSessionId}
                selectedDomain={selectedDomain}
                selectedLLM={selectedLLM}
              />
            )}

            {activeView === "help" && <HelpCenter />}

            {activeView === "settings" && (
              <SettingsPage
                domains={domains}
                setDomains={setDomains}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                schemas={schemas}
                setSchemas={setSchemas}
                selectedLLM={selectedLLM}
                setSelectedLLM={setSelectedLLM}
              />
            )}

            {activeView === "admin_users" && <AdminPanel type="users" />}
            {activeView === "admin_audit" && <AdminPanel type="audit" />}
          </main>
        </div>
      </div>
    </div>
  );
}
