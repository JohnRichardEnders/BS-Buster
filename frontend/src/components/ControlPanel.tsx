
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface ControlPanelProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  variant?: "large" | "small";
}

export const ControlPanel = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording,
  variant = "large" 
}: ControlPanelProps) => {
  const buttonClasses = variant === "large" 
    ? "text-lg py-8 px-12" 
    : "text-sm py-2 px-4";

  return (
    <Button
      onClick={isRecording ? onStopRecording : onStartRecording}
      size="lg"
      className={`transition-all duration-300 shadow-lg ${buttonClasses} ${
        isRecording 
          ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
          : "bg-green-500 hover:bg-green-600 shadow-green-500/20"
      }`}
    >
      {isRecording ? (
        <>
          <MicOff className={variant === "large" ? "mr-3 h-6 w-6" : "mr-2 h-4 w-4"} />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className={variant === "large" ? "mr-3 h-6 w-6" : "mr-2 h-4 w-4"} />
          Start Recording
        </>
      )}
    </Button>
  );
};
