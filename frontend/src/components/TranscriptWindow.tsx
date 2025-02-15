import React from 'react';

interface Claim {
  id: string;
  text: string;
  timestamp: string;
  speaker: string;
  status: 'verified' | 'disputed' | 'pending';
}

interface TranscriptWindowProps {
  claims: Claim[];
  liveTranscript: string;
}

export const TranscriptWindow: React.FC<TranscriptWindowProps> = ({ claims, liveTranscript }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Transcript</h2>
      
      {liveTranscript && (
        <div className="mb-4 p-3 bg-yellow-100 rounded">
          <h3 className="font-semibold">Live Transcript:</h3>
          <p>{liveTranscript}</p>
        </div>
      )}
      
      <ul className="space-y-4">
        {claims.map((claim) => (
          <li key={claim.id} className="border-b pb-2">
            <p className="font-semibold">{claim.speaker} - {claim.timestamp}</p>
            <p>{claim.text}</p>
            <span className={`text-sm ${
              claim.status === 'verified' ? 'text-green-600' :
              claim.status === 'disputed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {claim.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
