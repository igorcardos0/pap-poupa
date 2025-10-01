import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
};

export default function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "from-card to-card/50",
    success: "from-success/10 to-success/5 border-success/20",
    warning: "from-warning/10 to-warning/5 border-warning/20",
    destructive: "from-destructive/10 to-destructive/5 border-destructive/20",
  };

  return (
    <Card className={cn("p-6 shadow-card hover:shadow-lg-custom transition-all duration-300 bg-gradient-to-br", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-full", 
          variant === "success" ? "bg-success/10" :
          variant === "warning" ? "bg-warning/10" :
          variant === "destructive" ? "bg-destructive/10" :
          "bg-primary/10"
        )}>
          <Icon className={cn("h-6 w-6",
            variant === "success" ? "text-success" :
            variant === "warning" ? "text-warning" :
            variant === "destructive" ? "text-destructive" :
            "text-primary"
          )} />
        </div>
      </div>
    </Card>
  );
}
