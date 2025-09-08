import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DomainSelector from "./DomainSelector";

export default function SettingsPage({
  domains,
  setDomains,
  selectedDomain,
  setSelectedDomain,
  schemas,
  setSchemas,
  selectedLLM,
  setSelectedLLM,
}) {
  const [newDomain, setNewDomain] = useState("");
  const [editingDomain, setEditingDomain] = useState(null);
  const [schemaText, setSchemaText] = useState("");
  const [message, setMessage] = useState("");
  const LLM_OPTIONS = ["GPT-4", "Claude-3", "Llama-3"];

  useEffect(() => {
    setSchemaText(schemas[selectedDomain] || "");
  }, [selectedDomain, schemas]);

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    if (domains.includes(newDomain)) {
      setMessage("⚠️ Domain already exists.");
      return;
    }
    setDomains([...domains, newDomain]);
    setSchemas({ ...schemas, [newDomain]: "" });
    setNewDomain("");
    setMessage(`✅ Domain "${newDomain}" added!`);
  };

  const handleEditDomain = (oldDomain, newName) => {
    if (!newName.trim()) return;
    setDomains(domains.map((d) => (d === oldDomain ? newName : d)));
    if (selectedDomain === oldDomain) setSelectedDomain(newName);

    const newSchemas = { ...schemas };
    newSchemas[newName] = newSchemas[oldDomain] || "";
    delete newSchemas[oldDomain];
    setSchemas(newSchemas);

    setEditingDomain(null);
    setMessage(`✏️ Domain updated to "${newName}".`);
  };

  const handleDeleteDomain = (domain) => {
    setDomains(domains.filter((d) => d !== domain));
    if (selectedDomain === domain) setSelectedDomain("");
    const newSchemas = { ...schemas };
    delete newSchemas[domain];
    setSchemas(newSchemas);
    setMessage(`🗑️ Domain "${domain}" deleted.`);
  };

  const handleSchemaSave = () => {
    if (!selectedDomain) return;
    setSchemas({ ...schemas, [selectedDomain]: schemaText });
    setMessage(`✅ Schema saved for ${selectedDomain}`);
  };

  return (
    <div className="w-full h-full px-6 py-8 bg-[#f4f5f7] text-gray-800 overflow-y-auto max-h-screen">
      <h1 className="text-3xl font-bold text-left text-indigo-600 mb-8">
        Settings Page
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Domain Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Domain Settings
          </h2>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Default Domain
            </p>
            <DomainSelector
              selectedDomain={selectedDomain}
              onDomainChange={setSelectedDomain}
            />
          </div>

          <div className="flex gap-2 items-center mb-4">
            <input
              type="text"
              placeholder="Enter new domain"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleAddDomain}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 font-medium">Domain</th>
                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((domain) => (
                  <tr
                    key={domain}
                    className={`border-t ${
                      selectedDomain === domain ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2">
                      {editingDomain === domain ? (
                        <input
                          type="text"
                          defaultValue={domain}
                          onBlur={(e) =>
                            handleEditDomain(domain, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded-md text-sm"
                          autoFocus
                        />
                      ) : (
                        <span>{domain}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setEditingDomain(
                            editingDomain === domain ? null : domain
                          )
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDomain(domain)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {message && (
            <p className="text-sm text-gray-600 mt-2">{message}</p>
          )}
        </div>

        {/* LLM Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            LLM Settings
          </h2>
          <select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300"
          >
            {LLM_OPTIONS.map((llm) => (
              <option key={llm} value={llm}>
                {llm}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Current LLM: <span className="font-medium">{selectedLLM}</span>
          </p>
        </div>

        {/* Schema Editor */}
        <div className="bg-white rounded-xl p-6 shadow-sm col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            📑 Table Schema for {selectedDomain || "No domain selected"}
          </h2>
          {selectedDomain ? (
            <>
              <textarea
                rows={10}
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
                placeholder="Paste your SQL / table schema here..."
                className="w-full h-64 p-3 border rounded-md text-sm font-mono focus:ring-2 focus:ring-indigo-300 resize-none overflow-y-auto"
              />
              <button
                onClick={handleSchemaSave}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                Save Schema
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Please select a domain to edit its schema.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
