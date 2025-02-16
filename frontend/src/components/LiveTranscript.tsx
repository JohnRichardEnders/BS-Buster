import React, { useEffect, useState } from 'react';

export const LiveTranscript = () => {
  const [sentences, setSentences] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/transcript");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.transcript) {
        setSentences((prev) => [...prev, ...data.transcript]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="live-transcript p-4 bg-white/80 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-2">Live Transcript</h2>
      <ul>
        {sentences.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};
