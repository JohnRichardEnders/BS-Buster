
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Claim {
  id: string;
  text: string;
  timestamp: string;
  speaker: string;
  status: 'verified' | 'disputed' | 'pending';
}

interface TranscriptWindowProps {
  claims: Claim[];
}

export const TranscriptWindow = ({ claims }: TranscriptWindowProps) => {
  const getStatusStyles = (status: Claim['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 border-green-500/20';
      case 'disputed':
        return 'bg-red-500/10 border-red-500/20';
      case 'pending':
        return 'bg-gray-500/10 border-gray-500/20';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disputed':
        return (
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-500 text-sm font-bold">BULLSHIT!</span>
          </div>
        );
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${getStatusStyles(claim.status)}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{claim.timestamp}</span>
              <span className="text-sm font-medium text-gray-300">{claim.speaker}</span>
            </div>
            {getStatusIcon(claim.status)}
          </div>
          <p className="text-gray-200">{claim.text}</p>
        </div>
      ))}
    </div>
  );
};
