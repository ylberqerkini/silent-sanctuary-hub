import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  variant?: "default" | "primary" | "gold" | "success" | "warning";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20",
  gold: "bg-gradient-to-br from-gold/10 to-gold-light/5 border-gold/20",
  success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
  warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  gold: "bg-gold/15 text-gold-dark",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "from last month",
  icon,
  variant = "default",
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-serif text-3xl font-bold text-foreground">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {isPositive && (
                <span className="flex items-center text-success">
                  <ArrowUp className="h-3 w-3" />
                  {Math.abs(change)}%
                </span>
              )}
              {isNegative && (
                <span className="flex items-center text-destructive">
                  <ArrowDown className="h-3 w-3" />
                  {Math.abs(change)}%
                </span>
              )}
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          )}
        </div>
        
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
            iconStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
