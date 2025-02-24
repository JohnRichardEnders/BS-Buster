import React, { useState, useEffect, useRef } from 'react';

const AudioStreamer: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');

  // Establish the websocket connection once on mount
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/transcript/ws');
    ws.current.onopen = () => console.log('WebSocket connected');
    ws.current.onmessage = (event) => {
      const newTranscript = event.data;
      console.log('Transcript from server:', newTranscript);
      setTranscript(prevTranscript => prevTranscript + ' ' + newTranscript);
    };
    ws.current.onerror = (error) => console.error('WebSocket error:', error);
    return () => ws.current?.close();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      // When data is available, send it to the server
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0 && ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(event.data);
        }
      };
      // Start recording with chunks every 250ms (adjust as needed)
      mediaRecorderRef.current.start(250);
      setRecording(true);
      setTranscript(''); // Clear previous transcript when starting new recording
    } catch (err) {
      console.error('Error accessing microphone', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Effect to log the transcript whenever it changes
  useEffect(() => {
    if (transcript) {
      console.log('Current full transcript:', transcript);
    }
  }, [transcript]);

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && <p>Transcript: {transcript}</p>}
    </div>
  );
};

export default AudioStreamer;
