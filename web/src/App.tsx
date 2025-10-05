import EncryptForm from "./components/EncryptForm.tsx";
import DecryptForm from "./components/DecryptForm.tsx";
import LogTable from "./components/LogTable.tsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">
        Encryption Service
      </h1>

      <div className="forms-grid">
        <EncryptForm />
        <DecryptForm />
      </div>

      <div className="logs-section">
        <h2 className="logs-title">Request Logs</h2>
        <LogTable />
      </div>
    </div>
  );
}