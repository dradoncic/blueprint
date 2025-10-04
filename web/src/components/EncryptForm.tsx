import { useState } from "react";

export default function EncryptForm() {
  const [key, setKey] = useState("");
  const [data, setData] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEncrypt = async () => {
    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/v1/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResult(json.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Encrypt Data</h2>
      <input
        className="border rounded p-2 w-full"
        placeholder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <textarea
        className="border rounded p-2 w-full resize-none h-24"
        placeholder="Data"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button
        onClick={handleEncrypt}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Encrypting..." : "Encrypt"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <div className="bg-gray-100 p-2 rounded break-words">{result}</div>
      )}
    </div>
  );
}
