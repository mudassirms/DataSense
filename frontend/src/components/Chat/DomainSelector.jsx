import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DomainSelector({ selectedDomain, onDomainChange, defaultDomain = "Healthcare" }) {
  const [isOpen, setIsOpen] = useState(false);

  const domains = ["Healthcare", "Stock", "School", "Retail", "Finance"];

  useEffect(() => {
    if (!selectedDomain) {
      onDomainChange(defaultDomain);
    }
  }, [selectedDomain, defaultDomain, onDomainChange]);

  return (
    <div className="relative flex flex-col gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 
                   bg-white border border-gray-300 rounded-lg shadow-sm 
                   hover:bg-gray-50 transition text-gray-800 font-medium"
      >
        <span>{selectedDomain ? selectedDomain : "Select a Domain"}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 
                        rounded-lg shadow-lg z-50 overflow-hidden">
          <div
            onClick={() => {
              onDomainChange("");
              setIsOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic"
          >
            Select a Domain
          </div>

          {domains.map((domain) => (
            <div
              key={domain}
              onClick={() => {
                onDomainChange(domain);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedDomain === domain ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-800"
              }`}
            >
              {domain}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
