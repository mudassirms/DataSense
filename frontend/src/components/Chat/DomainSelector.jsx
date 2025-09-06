import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DomainSelector({ selectedDomain, onDomainChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Domains list (without "Select a Domain")
  const domains = ["Healthcare", "Stock", "School", "Retail", "Finance"];

  return (
    <div className="relative flex flex-col gap-2">
      {/* Tagline / Label */}
      <span className="text-sm font-medium text-gray-600">
    Please select a domain
      </span>

      {/* Selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 
                   bg-white border border-gray-300 rounded-lg shadow-sm 
                   hover:bg-gray-50 transition text-gray-800 font-medium"
      >
        <span>
          {selectedDomain ? selectedDomain : "Select a Domain"}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 
                        rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Default Option */}
          <div
            onClick={() => {
              onDomainChange("");
              setIsOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic"
          >
            Select a Domain
          </div>

          {/* Domain Options */}
          {domains.map((domain) => (
            <div
              key={domain}
              onClick={() => {
                onDomainChange(domain);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
            >
              {domain}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
