
import { Card } from "@/components/ui/card";
import { Check, X, Search } from "lucide-react";

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
    <Card className="w-80 p-6 bg-white/80 backdrop-blur-sm animate-slide-in">
      <h2 className="text-lg font-semibold mb-6">Session Metrics</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>Verified</span>
          </div>
          <span className="font-medium">{metrics.verified}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <X className="h-5 w-5 text-yellow-500" />
            <span>Disputed</span>
          </div>
          <span className="font-medium">{metrics.disputed}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-500" />
            <span>Pending</span>
          </div>
          <span className="font-medium">{metrics.pending}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Claims</span>
          <span className="font-medium">{total}</span>
        </div>
      </div>
    </Card>
  );
};
