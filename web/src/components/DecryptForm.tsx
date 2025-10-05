import { useState } from "react";
import "./DecryptForm.css";

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
        <div className="decrypt-form">
            <h2 className="form-title">Decrypt Data</h2>
            <input
                className="form-input"
                placeholder="Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            <textarea
                className="form-textarea"
                placeholder="Encrypted Data"
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <button
                onClick={handleDecrypt}
                className="decrypt-button"
                disabled={loading}
            >
                {loading ? "Decrypting..." : "Decrypt"}
            </button>
            {error && <div className="error-message">{error}</div>}
            {result && (
                <div className="result-box">
                    {result}
                </div>
            )}
        </div>
    );
}