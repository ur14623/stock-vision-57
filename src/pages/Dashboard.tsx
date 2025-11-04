import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={1234}
          icon={Package}
          trend={{ value: "12.5%", isPositive: true }}
          variant="default"
        />
        <MetricCard
          title="Low Stock Items"
          value={23}
          icon={AlertTriangle}
          trend={{ value: "5 critical", isPositive: false }}
          variant="warning"
        />
        <MetricCard
          title="Total Value"
          value="$45,231"
          icon={DollarSign}
          trend={{ value: "8.2%", isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Categories"
          value={42}
          icon={TrendingUp}
          trend={{ value: "3 new", isPositive: true }}
          variant="default"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
