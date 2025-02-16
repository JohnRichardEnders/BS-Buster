
import { Card } from "@/components/ui/card";
import { Check, XCircle, Search } from "lucide-react";

interface Metrics {
  verified: number;
  disputed: number;
  pending: number;
}

interface MetricsSidebarProps {
  metrics: Metrics;
}

export const MetricsSidebar = ({ metrics }: MetricsSidebarProps) => {
  const total = metrics.verified + metrics.disputed + metrics.pending;
  
  return (
    <Card className="p-6 glass-card animate-slide-in">
      <h2 className="text-xl font-semibold mb-6 text-white">Session Metrics</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-gray-200">Verified</span>
          </div>
          <span className="font-medium text-green-400">{metrics.verified}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-gray-200">BS Claims</span>
          </div>
          <span className="font-medium text-red-400">{metrics.disputed}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <span className="text-gray-200">Pending</span>
          </div>
          <span className="font-medium text-gray-400">{metrics.pending}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Total Claims</span>
          <span className="font-medium text-white">{total}</span>
        </div>
      </div>
    </Card>
  );
};
