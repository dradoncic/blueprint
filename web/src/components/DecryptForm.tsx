import { useState } from "react";

export default function DecryptForm() {
    const [key, setKey] = useState("");
    const [data, setData] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDecrypt = async () => {
        setLoading(true);
        setError("");
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await fetch(`${API_URL}/api/v1/decrypt`, {
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
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Decrypt Data</h2>
            
            <div className="space-y-4">
                <input
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Decryption Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                />
                
                <textarea
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[120px] resize-y"
                    placeholder="Encrypted data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
                
                <button
                    onClick={handleDecrypt}
                    className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    disabled={loading}
                >
                    {loading ? "Decrypting..." : "Decrypt"}
                </button>
                
                {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                        {error}
                    </div>
                )}
                
                {result && (
                    <div className="p-4 bg-muted border border-border rounded-md">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Decrypted Result:</p>
                        <p className="text-sm text-foreground font-mono break-all">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}