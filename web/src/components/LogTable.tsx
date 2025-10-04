import { useEffect, useState } from "react";

interface LogItem {
  id: string;
  timestamp: number;
  ip: string;
  data: string;
}

export default function LogTable() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/v1/logs?size=20`)
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <div className="overflow-x-auto">
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
