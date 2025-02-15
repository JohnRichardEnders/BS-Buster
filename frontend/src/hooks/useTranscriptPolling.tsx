import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useTranscriptPolling = (isRecording: boolean, intervalMs: number = 10000) => {
  const [transcript, setTranscript] = useState<string>('');

  const fetchTranscript = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }
      
      const data = await response.json();
      setTranscript(data.transcription);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transcript. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {

    console.log("hi there")
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = async () => {
      await fetchTranscript();
      timeoutId = setTimeout(tick, intervalMs);
    };

    if (isRecording) {
      tick(); // Start the polling loop
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isRecording, fetchTranscript, intervalMs]);

  return transcript;
};