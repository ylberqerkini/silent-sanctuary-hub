import { Button } from "@/components/ui/button";
import { Plus, Send, Download, RefreshCw } from "lucide-react";

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button variant="islamic" className="h-auto flex-col gap-2 py-4">
          <Plus className="h-5 w-5" />
          <span className="text-xs">Add Mosque</span>
        </Button>
        
        <Button variant="gold" className="h-auto flex-col gap-2 py-4">
          <Send className="h-5 w-5" />
          <span className="text-xs">Send Alert</span>
        </Button>
        
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <Download className="h-5 w-5" />
          <span className="text-xs">Export Data</span>
        </Button>
        
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <RefreshCw className="h-5 w-5" />
          <span className="text-xs">Sync All</span>
        </Button>
      </div>
    </div>
  );
}
