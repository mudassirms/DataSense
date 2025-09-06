import { useRef, useEffect, useState } from "react";
import { askQuestion, fetchConversationHistory } from "../../api";
import ImageGallery from "./ImageGallary";
import {
  Mic,
  Copy,
  Volume2,
  Volume1,
  Check,
  Send,
  HelpCircle,
} from "lucide-react";

const extractLanguageTagFromHTML = (html) => {
  if (typeof html !== 'string') return null;
  const match = html.match(/<!--\s*lang:\s*([a-zA-Z-]+)\s*-->/);
  return match ? match[1] : null;
};

export default function ChatInterface({ sessionId, messages, setMessages, selectedDomain  }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const helpRef = useRef(null);

  const [availableVoices, setAvailableVoices] = useState([]);

  const domainExamples = {
  Healthcare: [
    "How to renew boiler certificate?",
    "How do I check existing patient information?",
    "Where can I view my past records?",
    "How can I get boiler certificate?"
  ],
  Stock: [
    "Show me today’s top gainers",
    "How to analyze stock performance?",
    "What are the latest market trends?",
    "Which stocks should I watch this week?"
  ],
  School: [
    "How to check student attendance?",
    "Show me past exam results",
    "How to upload assignments?",
    "Where can I find timetable updates?"
  ],
  Retail: [
    "Show me today’s sales report",
    "How do I check inventory levels?",
    "How to add new product listings?",
    "Give me customer feedback analysis"
  ],
  Finance: [
    "What are my current account balances?",
    "Generate monthly expense report",
    "How to apply for a loan?",
    "Show me last year’s tax summary"
  ]
};

const exampleQuestions = domainExamples[selectedDomain] || [];

  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) {
        setMessages([]); 
        return;
      }

      try {
        const data = await fetchConversationHistory(sessionId);

        const transformedMessages = Array.isArray(data)
          ? data.map(msg => ({
              
              role: msg.role === 'assistant' ? 'bot' : msg.role, 
              text: msg.content || '',
              images: msg.images || [], 
              time: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              
              language: extractLanguageTagFromHTML(msg.content) || "en-US",
            }))
          : []; 

        setMessages(transformedMessages);
   

      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessages([]); 
      }
    };

    loadMessages();
  }, [sessionId, setMessages]); 

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      setTimeout(loadVoices, 100);
    }
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const updateRecognitionLanguage = (lang) => {
    if (recognitionRef.current && lang) {
      recognitionRef.current.lang = lang;
    }
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (!listening) {
        recognitionRef.current.start();
        setListening(true);
      } else {
        recognitionRef.current.stop();
        setListening(false);
      }
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeakToggle = (text, id) => {
    const cleanText = text.replace(/<[^>]*>?/gm, "");

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const detectedLanguage = messages[id]?.language || "en-US";

    const voice = availableVoices.find((v) =>
      v.lang.toLowerCase().startsWith(detectedLanguage.toLowerCase())
    ) || availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0];

    if (!voice) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.9;

    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setInput("");
    setErrorMessage("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userInput, time: new Date() },
      { role: "typing", text: "...", time: new Date() }, 
    ]);

    try {
      const apiResponse = await askQuestion(userInput);

      const botResponseText = apiResponse.response;
      const botImages = apiResponse.images || []; 

      const detectedLang = extractLanguageTagFromHTML(botResponseText);
      updateRecognitionLanguage(detectedLang);

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); 
        return [
          ...updated,
          {
            role: "bot", 
            text: botResponseText, 
            images: botImages,
            time: new Date(),
            language: detectedLang || "en-US",
          },
        ];
      });
    } catch (err) {
      console.error("Error asking question:", err);
      setMessages((prev) => prev.filter((msg) => msg.role !== "typing")); // Remove typing indicator on error
      setErrorMessage("Hmm... I couldn't process that. Try rephrasing your question.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]); 

  useEffect(() => {
    inputRef.current?.focus(); 
  }, []);

  const handleSuggestionClick = (question) => {
    setInput(question);
    setShowHelp(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setShowHelp(false);
      }
    };
    if (showHelp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHelp]);

  useEffect(() => {
  if (inputRef.current) {
    inputRef.current.style.height = "auto"; 
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; 
  }
}, [input]);

 return (
    <div className="flex flex-col h-full w-full bg-white">
<div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-10 text-gray-800">        {/* Welcome Screen */}
        {messages && Array.isArray(messages) && messages.length === 0 ? (
          <div className="text-center mt-10">
                        <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">

              Welcome to DataSense
            </h1>
            <p className="text-gray-600 mb-6">How can I assist you today?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(q)}
                  className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-full shadow-sm hover:bg-blue-200 text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
      ) : (
        <div className="w-full space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[85%] px-6 py-4 rounded-2xl shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm space-y-2">
                  {msg.role === "bot" && msg.language && (
                    <div className="text-xs italic text-cyan-400">
                      Detected language: {msg.language}
                    </div>
                  )}
                  {msg.role === "bot" || msg.role === "typing" ? (
                    msg.text === "..." ? (
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></span>
                          <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></span>
                      </div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    )
                  ) : (
                    <div>{msg.text}</div>
                  )}
                  {msg.images?.length > 0 && (
                    <div className="mt-3">
                      <ImageGallery images={msg.images} />
                    </div>
                  )}
                </div>

                {msg.role === "bot" && msg.text !== "..." && (
                  <div className="absolute top-2 right-3 flex gap-2">
                    <button
                      onClick={() => handleCopy(msg.text, index)}
                      title={copiedIndex === index ? "Copied!" : "Copy"}
                      className="p-1 rounded hover:bg-cyan-500/20 transition"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSpeakToggle(msg.text, index)}
                      title={speakingId === index ? "Stop" : "Speak"}
                      className={`p-1 rounded hover:bg-cyan-500/20 transition ${
                        speakingId === index ? "animate-pulse text-blue-600" : ""
                      }`}
                    >
                      {speakingId === index ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Volume1 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {errorMessage && (
        <div className="text-center text-red-400 mt-4">{errorMessage}</div>
      )}
    </div>

    {/* Input Section */}
      <div className="border-gray-300 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2 relative">
        {/* Help */}
        <div ref={helpRef} className="relative">
          <button
            onClick={() => setShowHelp(!showHelp)}
          className="p-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {showHelp && (
            <div className="absolute bottom-16 left-0 w-80 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-20">
              <p className="font-semibold mb-2 text-cyan-400">Try asking:</p>
              <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                {exampleQuestions.map((q, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(q)}
                    className="cursor-pointer hover:underline hover:text-blue-600"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative flex-1">
  <textarea
    ref={inputRef}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); 
        handleSend();
      }
    }}
    placeholder="Type your message..."
    rows={1}
    className="w-full px-4 py-8 pr-14 rounded-xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    onClick={handleSend}
    disabled={loading || !input.trim()}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-blue-600 hover:bg-blue-100 disabled:text-gray-400"
              title="Send"
  >
    <Send className="w-5 h-5" />
  </button>
</div>


        <button
          onClick={handleVoiceInput}
          className={`p-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 ${
            listening ? "ring-4 ring-cyan-400 animate-pulse" : ""
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
 );
}