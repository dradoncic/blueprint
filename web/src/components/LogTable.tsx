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

    useEffect(() => {
        fetchLogs();
    }, [size, offset]);

    return (
        <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
            {/* Controls Section */}
            <div className="p-4 bg-muted/50 border-b border-border flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-medium">Size:</span>
                    <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 bg-card border border-input rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                    <span className="text-foreground font-medium">Offset:</span>
                    <input
                        type="number"
                        value={offset}
                        onChange={(e) => setOffset(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 bg-card border border-input rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </label>
                
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-1.5 bg-secondary text-secondary-foreground rounded font-medium text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        Reload
                    </button>
                    
                    <button
                        onClick={handlePrevious}
                        className="px-4 py-1.5 bg-primary text-primary-foreground rounded font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={offset === 0}
                    >
                        Previous
                    </button>
                    
                    <button
                        onClick={handleNext}
                        className="px-4 py-1.5 bg-primary text-primary-foreground rounded font-medium text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                IP Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Data
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-foreground">
                                        {log.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground">
                                        {new Date(log.timestamp * 1000).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-foreground">
                                        {log.ip}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-foreground max-w-md truncate">
                                        {log.data}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                    No logs available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}