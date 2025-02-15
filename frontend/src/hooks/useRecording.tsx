import { useState, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/start', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start recording');
      }

      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Your fact-checking session is now active.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not start recording. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/stop', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to stop recording');
      }

      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Your fact-checking session has ended.",
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast({
        title: "Error",
        description: "Could not stop recording. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
