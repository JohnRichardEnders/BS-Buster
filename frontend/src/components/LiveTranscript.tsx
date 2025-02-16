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
    <div>
      <ul>
        {sentences.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};
