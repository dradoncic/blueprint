import { useEffect, useState } from "react";
import "./LogTable.css";

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

    useEffect(() => {
        fetchLogs();
    }, [size, offset]);

    return (
        <div className="log-table-container">
            <div className="controls-section">
                <label className="control-label">
                    Size:{" "}
                    <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="control-input"
                    />
                </label>
                <label className="control-label">
                    Offset:{" "}
                    <input
                        type="number"
                        value={offset}
                        onChange={(e) => setOffset(Number(e.target.value))}
                        className="control-input"
                    />
                </label>
                <button
                    onClick={fetchLogs}
                    className="control-button reload-button"
                >
                    Reload Logs
                </button>
                <button
                    onClick={handlePrevious}
                    className="control-button nav-button"
                    disabled={offset === 0}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="control-button nav-button"
                >
                    Next
                </button>
            </div>

            <table className="log-table">
                <thead className="table-header">
                    <tr>
                        <th>ID</th>
                        <th>Timestamp</th>
                        <th>IP</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} className="table-row">
                            <td className="table-cell id-cell">{log.id}</td>
                            <td className="table-cell timestamp-cell">
                                {new Date(log.timestamp * 1000).toLocaleString()}
                            </td>
                            <td className="table-cell ip-cell">{log.ip}</td>
                            <td className="table-cell data-cell">{log.data}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}