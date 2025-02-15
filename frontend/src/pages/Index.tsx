
import { useEffect, useState } from 'react';
import { useRecording } from '@/hooks/useRecording';
import { ControlPanel } from '@/components/ControlPanel';
import { TranscriptWindow } from '@/components/TranscriptWindow';
import { MetricsSidebar } from '@/components/MetricsSidebar';
import { useTranscriptPolling } from '@/hooks/useTranscriptPolling';

// Mock data for initial UI
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
  const liveTranscript = useTranscriptPolling(isRecording);
  const [claims, setClaims] = useState([]);
  const [metrics] = useState(initialMetrics);


  useEffect(() => {
    if (liveTranscript) {
      if(liveTranscript.length != 0){
        const newClaim = {
          id: Date.now().toString(),
          text: liveTranscript,
          timestamp: new Date().toLocaleTimeString(),
          speaker: "Live Speaker",
          status: 'pending' as const,
        };
        setClaims(prevClaims => [newClaim, ...prevClaims]);
      }
    }
  }, [liveTranscript]);

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
          <div className="flex-1">
            <TranscriptWindow claims={claims} liveTranscript={liveTranscript} />
          </div>
          <MetricsSidebar metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default Index;
