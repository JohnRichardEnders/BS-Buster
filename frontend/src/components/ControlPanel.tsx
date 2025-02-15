
import { Button } from "@/components/ui/button";
import { Settings, Download, Mic, MicOff } from "lucide-react";

interface ControlPanelProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const ControlPanel = ({ isRecording, onStartRecording, onStopRecording }: ControlPanelProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm animate-fade-in">
      <Button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`relative transition-all duration-300 ${
          isRecording 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isRecording ? (
          <>
            <MicOff className="mr-2 h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </>
        )}
      </Button>
      
      <Button variant="outline" className="ml-auto">
        <Download className="h-4 w-4" />
      </Button>
      
      <Button variant="outline">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};
