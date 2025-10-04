import EncryptForm from "./components/EncryptForm.tsx";
import DecryptForm from "./components/DecryptForm.tsx";
import LogTable from "./components/LogTable.tsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Encryption Service
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <EncryptForm />
        <DecryptForm />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Request Logs</h2>
        <LogTable />
      </div>
    </div>
  );
}
