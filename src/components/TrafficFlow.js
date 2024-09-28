import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Play, Square } from 'lucide-react';

const TRAFFIC_TYPES = {
  "Instagram": { color: "#E1306C" },
  "WhatsApp": { color: "#25D366" },
  "YouTube": { color: "#FF0000" },
  "Voice Call": { color: "#0077FF" },
  "Text Message": { color: "#FFD700" },
  "Voice Message": { color: "#FF6600" }
};

const TrafficFlow = () => {
  const [activeTraffic, setActiveTraffic] = useState(null);
  const [lastData, setLastData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ws, setWs] = useState(null);

  const connectWebSocket = useCallback(() => {
    const newWs = new WebSocket('wss://trafficgenerator.onrender.com/ws');
    
    newWs.onopen = () => {
      console.log('WebSocket Connected');
      setWs(newWs);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "stopped") {
          setIsGenerating(false);
        } else {
          setLastData(data);
          setActiveTraffic(data.traffic_type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newWs.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(connectWebSocket, 5000);
    };

    return () => {
      newWs.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  const toggleTrafficGeneration = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (isGenerating) {
        ws.send('stop');
      } else {
        ws.send('start');
      }
      setIsGenerating(!isGenerating);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Network Traffic Visualization</h1>
      <div className="mb-4">
        <button
          className={`px-4 py-2 text-white rounded transition-colors flex items-center ${
            isGenerating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={toggleTrafficGeneration}
        >
          {isGenerating ? (
            <>
              <Square size={16} className="mr-2" />
              Stop Traffic
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Start Traffic
            </>
          )}
        </button>
      </div>
      <div className="flex justify-between items-center flex-grow">
        <div className="space-y-4">
          {Object.entries(TRAFFIC_TYPES).map(([type, { color }]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          {activeTraffic && (
            <div className="relative flex items-center justify-center w-full">
              <div 
                className="w-48 h-48 rounded-full transition-colors duration-500 ease-in-out flex items-center justify-center"
                style={{ backgroundColor: TRAFFIC_TYPES[activeTraffic].color }}
              >
                <span className="text-white font-bold text-lg">{activeTraffic}</span>
              </div>
              <ArrowRight 
                className="absolute right-0" 
                size={32}
                color={TRAFFIC_TYPES[activeTraffic].color}
              />
            </div>
          )}
        </div>
        
        <div className="w-16 h-32 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">Server</span>
        </div>
      </div>
      {lastData && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Last Received Data:</h2>
          <pre className="text-sm">{JSON.stringify(lastData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TrafficFlow;