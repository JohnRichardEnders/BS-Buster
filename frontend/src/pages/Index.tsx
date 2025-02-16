import { useEffect, useState } from 'react';
import { useRecording } from '@/hooks/useRecording';
import { ControlPanel } from '@/components/ControlPanel';
import { TranscriptWindow as ClaimWindow } from '@/components/TranscriptWindow';
import { MetricsSidebar } from '@/components/MetricsSidebar';
import { useTranscriptPolling } from '@/hooks/useTranscriptPolling';
import { LiveTranscript } from '@/components/LiveTranscript';

// (Optional) Initial claims for demo purposes
const initialClaims = [
  {
    id: '1',
    text: "The first electric car was built in 1884.",
    timestamp: "10:15:23",
    speaker: "Speaker A",
    status: 'verified' as const,
  },
];

const initialMetrics = {
  verified: 1,
  disputed: 1,
  pending: 1,
};

const Index = () => {
  const { isRecording, startRecording, stopRecording } = useRecording();
  // The polling hook now returns an array of claim strings.
  const polledClaims = useTranscriptPolling(isRecording);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (polledClaims.length > 0) {
      // Create a new claim for each returned claim string.
      const newClaims = polledClaims.map((claimText: string) => ({
        id: Date.now().toString() + Math.random().toString(),
        text: claimText,
        timestamp: new Date().toLocaleTimeString(),
        speaker: "Live Speaker",
        status: 'pending' as const,
      }));
      // Prepend new claims to the existing list.
      setClaims(prevClaims => [...newClaims, ...prevClaims]);
    }
  }, [polledClaims]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <ControlPanel
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />
        </div>
        
        <div className="flex gap-6">
          <LiveTranscript />
          <div className="flex-1">
            {/* Pass the list of claim objects to the display component */}
            <ClaimWindow claims={claims} />
          </div>
          <MetricsSidebar metrics={initialMetrics} />
        </div>
      </div>
    </div>
  );
};

export default Index;