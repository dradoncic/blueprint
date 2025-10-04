import { useEffect, useState } from "react";

interface LogItem {
  id: string;
  timestamp: number;
  ip: string;
  data: string;
}

export default function LogTable() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [size, setSize] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchLogs = () => {
    fetch(`${API_URL}/api/v1/logs?size=${size}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Failed to fetch logs:", err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - size, 0));
  };

  const handleNext = () => {
    setOffset((prev) => prev + size);
  };

  // Refetch whenever size or offset changes
  useEffect(() => {
    fetchLogs();
  }, [size, offset]);

  return (
    <div className="overflow-x-auto">
      <div className="mb-2 flex gap-2 items-center">
        <label>
          Size:{" "}
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          />
        </label>
        <label>
          Offset:{" "}
          <input
            type="number"
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          />
        </label>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Logs
        </button>
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={offset === 0}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Timestamp</th>
            <th className="border p-2 text-left">IP</th>
            <th className="border p-2 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="border p-2">{log.id}</td>
              <td className="border p-2">
                {new Date(log.timestamp * 1000).toLocaleString()}
              </td>
              <td className="border p-2">{log.ip}</td>
              <td className="border p-2 break-all">{log.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
