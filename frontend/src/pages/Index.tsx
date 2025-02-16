import { useEffect, useState } from 'react';
import { useRecording } from '@/hooks/useRecording';
import { ControlPanel } from '@/components/ControlPanel';
import { TranscriptWindow as ClaimWindow } from '@/components/TranscriptWindow';
import { MetricsSidebar } from '@/components/MetricsSidebar';
import { useTranscriptPolling } from '@/hooks/useTranscriptPolling';
import { LiveTranscript } from '@/components/LiveTranscript';
import { Card } from '@/components/ui/card';

// Remove initial claims
const initialClaims = [];

const initialMetrics = {
  verified: 0,
  disputed: 0,
  unverifiable: 0,
  pending: 0,
};

const Index = () => {
  const { isRecording, startRecording, stopRecording } = useRecording();
  // The polling hook now returns an array of claim strings.
  const polledClaims = useTranscriptPolling(isRecording);
  const [claims, setClaims] = useState([]);
  const [metrics, setMetrics] = useState(initialMetrics);

  const updateClaim = (updatedClaim) => {
    setClaims(prevClaims => 
      prevClaims.map(claim => 
        claim.id === updatedClaim.id ? updatedClaim : claim
      )
    );

    // Update metrics
    setMetrics(prevMetrics => {
      const newMetrics = { ...prevMetrics };
      
      // Decrement the previous status count
      const oldClaim = claims.find(c => c.id === updatedClaim.id);
      if (oldClaim) {
        newMetrics[oldClaim.status] = Math.max(0, newMetrics[oldClaim.status] - 1);
      }
      
      // Increment the new status count
      newMetrics[updatedClaim.status] = (newMetrics[updatedClaim.status] || 0) + 1;
      
      return newMetrics;
    });
  };

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
      
      // Update metrics for new pending claims
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        pending: prevMetrics.pending + newClaims.length
      }));
    }
  }, [polledClaims]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4">
        <div className="transition-all duration-700">
          {isRecording ? (
            <div className="py-4 mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold gradient-text">BS Buster</h1>
                <ControlPanel
                  isRecording={isRecording}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  variant="small"
                />
              </div>
            </div>
          ) : (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-12">
              <div className="text-center space-y-4 animate-fade-in">
                <h1 className="text-7xl font-bold gradient-text">BS Buster</h1>
                <p className="text-2xl text-gray-400">Your nonsense ends here.</p>
              </div>
              
              <div className="animate-fade-in">
                <ControlPanel
                  isRecording={isRecording}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  variant="large"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card className="p-4 glass-card h-full">
              <h2 className="text-xl font-semibold mb-4 text-white">Live Transcript</h2>
              <div className="h-[300px] overflow-y-auto bg-black/50 rounded-lg p-4">
                <LiveTranscript />
                {/* <p className="text-gray-400">Recording will appear here...</p> */}
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="glass-card h-full">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Claims Analysis</h2>
              </div>
              <ClaimWindow claims={claims} onClaimUpdate={updateClaim} />
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <MetricsSidebar metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default Index;