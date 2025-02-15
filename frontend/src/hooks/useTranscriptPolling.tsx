import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useTranscriptPolling = (isRecording: boolean) => {
  const [transcript, setTranscript] = useState<string>('');

  const fetchTranscript = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can add a body here if needed
        // body: JSON.stringify({ /* any data you need to send */ }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }
      
      const data = await response.json();
      console.log("test")
      console.log(data);
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
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      fetchTranscript(); // Fetch immediately when recording starts
      intervalId = setInterval(fetchTranscript, 5000); // Then every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, fetchTranscript]);

  return transcript;
};
