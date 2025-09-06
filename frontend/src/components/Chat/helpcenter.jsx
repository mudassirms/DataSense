import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I start a new chat?",
    answer:
      "Click on the 'New Chat' icon in the sidebar to begin a new conversation with the assistant.",
  },
  {
    question: "How can I access previous conversations?",
    answer:
      "Go to the 'Conversations' section in the sidebar to see a list of your previous chats.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data is stored securely and never shared with third parties. You can delete your data at any time from Settings.",
  },
  {
    question: "How can I enable voice input?",
    answer:
      "Click the mic icon in the chat interface and allow microphone access in your browser settings.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full h-full px-6 py-8 bg-[#f4f5f7] text-gray-800 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Help Center
      </h1>

      {/* === Grid layout for sections === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-8xl mx-auto">
        {/* About DataSense */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            ℹ️ About DataSense
          </h2>
          <p className="text-sm py-2 text-gray-700 ">In today's fast-paced digital landscape, customer support has become a critical differentiator for 
          businesses. However, traditional support models face significant challenges: overwhelmed teams 
          handling repetitive queries, long resolution times, escalating operational costs, and inconsistent 
          service quality across different time zones and languages.</p>

          <p className="text-sm text-gray-700">
            <strong>DataSense</strong>  is an advanced AI-powered L1 support assistant designed to revolutionize how 
businesses handle customer inquiries. By automating the first level of support with intelligent, 
context-aware responses, DataSense enables organizations to deliver instant, accurate, and 
consistent customer service while dramatically reducing operational overhead.
          </p>
          {/* Getting Started */}
          <h2 className="text-xl py-5 font-semibold  text-indigo-600">
          🚀Getting Started
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Sign in using your credentials to access the platform.</li>
            <li>Click on “New Chat” to begin a conversation.</li>
            <li>Explore voice and text input options in the chat interface.</li>
          </ul>

          <h2 className="text-xl py-3 font-semibold  text-indigo-600">
              Core Capabilities
          </h2>
          <h1 className="text=xm py-2 font-semibold">1. Adaptive Knowledge Training</h1>
          <ul className=" text-sm space-y-1 px-2 text-gray-700">
            <li>DataSense's most powerful feature is its ability to learn and adapt to any business domain through comprehensive document training.</li>
          </ul>
          <h1 className="text=xm py-2 font-semibold">2. Visual Support Enhancement</h1>
          <ul className=" text-sm space-y-1 px-2 text-gray-700">
            <li>Traditional text-based support often falls short when explaining complex visual processes. DataSense bridges this gap by providing contextual screenshots and visual aids.</li>
          </ul>
          <h1 className="text=xm py-2 font-semibold">3. WhatsApp Integration</h1>
          <ul className=" text-sm space-y-1 px-2 text-gray-700">
            <li>Recognizing that customers prefer familiar messaging platforms, DataSense offers seamless WhatsApp integration for direct customer interaction.</li>
          </ul>
          <h1 className="text=xm py-2 font-semibold">4.  Multilingual Support</h1>
          <ul className=" text-sm space-y-1 px-2 text-gray-700">
            <li>Businesses need support solutions that work in different languages. DataSense provides comprehensive multilingual capabilities.</li>
          </ul>

          <h2 className="text-xl font-semibold py-5 text-indigo-600">
            🔐 Data & Privacy
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>We do not share your data with third parties.</li>
            <li>You can delete your history from the Settings page.</li>
            <li>Voice data is processed locally in your browser.</li>
          </ul>

          <h2 className="text-xl py-6 font-semibold mb-2 text-indigo-600">
            ❓Frequently Asked Questions
          </h2>
          <div className="space-y-3 ">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-md p-4 bg-gray-50 shadow-inner"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800"
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="mt-2 text-sm text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl py-5 font-semibold mb-1 text-indigo-600">
            📞 Contact Support
          </h2>
          <p className="text-sm text-gray-700">
  If you're facing issues not listed above, please email us at:{" "}
  <a
    href="mailto:business@maverickignite.com"
    className="text-indigo-600 font-medium"
  >
    business@maverickignite.com
  </a>
  . We typically respond within 24 hours.
</p>

        </div>

        {/* Supported Use Cases */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            🧠 Current Use Cases
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              <strong>Boiler Renewal Certificate:</strong> Guidance on renewal
              steps, document checklists, FAQs, and application status for
              industrial boiler certification.
            </li>
            <li>
              <strong>Maharashtra Portal Support:</strong> Help with navigation,
              form submissions, grievance tracking, and account setup for users
              of Maharashtra government portals.
            </li>
          </ul>
          <h2 className="text-xl py-6 font-semibold mb-2 text-indigo-600">
            ❓Frequently Asked Questions
          </h2>
          <div className="space-y-3 ">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-md p-4 bg-gray-50 shadow-inner"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800"
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="mt-2 text-sm text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
