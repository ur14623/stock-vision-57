import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "stock_added",
    product: "Wireless Mouse",
    quantity: 50,
    timestamp: "2 hours ago",
    icon: TrendingUp,
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "low_stock",
    product: "USB Cable Type-C",
    quantity: 5,
    timestamp: "3 hours ago",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  {
    id: 3,
    type: "stock_removed",
    product: "Laptop Stand",
    quantity: 15,
    timestamp: "5 hours ago",
    icon: TrendingDown,
    iconColor: "text-destructive",
  },
  {
    id: 4,
    type: "new_product",
    product: "Mechanical Keyboard",
    quantity: 100,
    timestamp: "1 day ago",
    icon: Package,
    iconColor: "text-primary",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className={`p-2 rounded-lg bg-muted ${activity.iconColor}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.product}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.type === "stock_added" && `Added ${activity.quantity} units`}
                  {activity.type === "stock_removed" && `Removed ${activity.quantity} units`}
                  {activity.type === "low_stock" && `Only ${activity.quantity} units left`}
                  {activity.type === "new_product" && `New product added with ${activity.quantity} units`}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
