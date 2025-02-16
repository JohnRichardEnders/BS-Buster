import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, CircleHelp} from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

interface FactCheckResponse {
  claim: string;
  result: 'True' | 'False' | 'Unverifiable';
  correction?: string;
  source?: string;
}

interface Claim {
  id: string;
  text: string;
  timestamp: string;
  speaker: string;
  status: 'verified' | 'disputed' | 'unverifiable' | 'pending';
  correction?: string;
  source?: string;
}

interface TranscriptWindowProps {
  claims: Claim[];
  onClaimUpdate: (claim: Claim) => void;
}

export const TranscriptWindow = ({ claims, onClaimUpdate }: TranscriptWindowProps) => {
  // Keep track of claims we've already checked
  const checkedClaimsRef = useRef<Set<string>>(new Set());

  const checkClaim = useCallback(async (claim: Claim) => {
    // If we've already checked this claim, skip it
    if (checkedClaimsRef.current.has(claim.id)) {
      return;
    }

    // Mark this claim as checked
    checkedClaimsRef.current.add(claim.id);

    try {
      const response = await fetch('http://localhost:8000/fact-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: claim.text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fact check claim');
      }

      const result: FactCheckResponse = await response.json();
      
      // Create updated claim with proper typing
      const updatedClaim: Claim = {
        ...claim,
        status: result.result === 'True' ? 'verified' : 
               result.result === 'False' ? 'disputed' : 
               result.result === 'Unverifiable' ? 'unverifiable' :
               'pending',
        correction: result.correction,
        source: result.source,
      };

      // Call the onClaimUpdate callback with the updated claim
      onClaimUpdate(updatedClaim);
    } catch (error) {
      console.error('Error fact checking claim:', error);
      // Remove from checked claims if there was an error, so we can retry
      checkedClaimsRef.current.delete(claim.id);
    }
  }, [onClaimUpdate]);

  useEffect(() => {
    const newPendingClaims = claims.filter(
      claim => claim.status === 'pending' && !checkedClaimsRef.current.has(claim.id)
    );

    newPendingClaims.forEach(claim => {
      checkClaim(claim);
    });
  }, [claims, checkClaim]); // Add checkClaim to dependencies

  const getStatusStyles = (status: Claim['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 border-green-500/20';
      case 'disputed':
        return 'bg-red-500/10 border-red-500/20';
      case 'unverifiable':
        return 'bg-purple-500/10 border-purple-500/20';
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
      case 'unverifiable':
        return <CircleHelp className="h-5 w-5 text-purple-500" />;
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
          {claim.correction && (
            <p className="mt-2 text-sm text-yellow-400">
              Correction: {claim.correction}
            </p>
          )}
          {claim.source && (
            <a 
              href={claim.source} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-1 text-xs text-blue-400 hover:underline block"
            >
              Source
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
