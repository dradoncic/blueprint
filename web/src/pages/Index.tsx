import EncryptForm from "@/components/EncryptForm";
import DecryptForm from "@/components/DecryptForm";
import LogTable from "@/components/LogTable";
import { Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Encryption Service
          </h1>
          <p className="text-muted-foreground text-lg">
            Secure data encryption and decryption platform
          </p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <EncryptForm />
          <DecryptForm />
        </div>

        {/* Logs Section */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Request Logs
          </h2>
          <LogTable />
        </div>
      </div>
    </div>
  );
};

export default Index;
