import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign } from "lucide-react";

// Mock data for charts
const inventoryTrendData = [
  { month: "Jan", inStock: 4800, lowStock: 120, outOfStock: 45 },
  { month: "Feb", inStock: 5200, lowStock: 98, outOfStock: 32 },
  { month: "Mar", inStock: 5600, lowStock: 85, outOfStock: 28 },
  { month: "Apr", inStock: 5400, lowStock: 110, outOfStock: 40 },
  { month: "May", inStock: 6100, lowStock: 75, outOfStock: 22 },
  { month: "Jun", inStock: 6500, lowStock: 68, outOfStock: 18 },
];

const categoryDistribution = [
  { name: "Electronics", value: 2400, color: "hsl(217, 91%, 60%)" },
  { name: "Clothing", value: 1800, color: "hsl(160, 84%, 39%)" },
  { name: "Food & Beverage", value: 1200, color: "hsl(38, 92%, 50%)" },
  { name: "Home & Garden", value: 1500, color: "hsl(270, 91%, 65%)" },
  { name: "Sports", value: 900, color: "hsl(0, 72%, 60%)" },
];

const revenueData = [
  { month: "Jan", revenue: 45000, cost: 32000 },
  { month: "Feb", revenue: 52000, cost: 35000 },
  { month: "Mar", revenue: 58000, cost: 38000 },
  { month: "Apr", revenue: 54000, cost: 36000 },
  { month: "May", revenue: 67000, cost: 42000 },
  { month: "Jun", revenue: 72000, cost: 45000 },
];

const topProducts = [
  { name: "Wireless Headphones", sales: 1245, revenue: "$62,250", trend: "+12%" },
  { name: "Smart Watch Pro", sales: 987, revenue: "$49,350", trend: "+8%" },
  { name: "USB-C Cable", sales: 856, revenue: "$8,560", trend: "+15%" },
  { name: "Laptop Stand", sales: 743, revenue: "$22,290", trend: "+5%" },
  { name: "Keyboard Mechanical", sales: 698, revenue: "$69,800", trend: "+18%" },
];

const lowStockItems = [
  { name: "Gaming Mouse", current: 12, minimum: 50, status: "Critical" },
  { name: "Phone Case Pro", current: 18, minimum: 40, status: "Low" },
  { name: "Laptop Charger", current: 25, minimum: 60, status: "Low" },
  { name: "Screen Protector", current: 8, minimum: 30, status: "Critical" },
  { name: "Power Bank", current: 15, minimum: 45, status: "Low" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your inventory performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Inventory Value"
          value="$342.5K"
          icon={DollarSign}
          trend={{ value: "12.5% from last month", isPositive: true }}
          variant="default"
        />
        <MetricCard
          title="Products in Stock"
          value="6,500"
          icon={Package}
          trend={{ value: "8.2% from last month", isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Low Stock Items"
          value="68"
          icon={TrendingDown}
          trend={{ value: "15% from last month", isPositive: false }}
          variant="warning"
        />
        <MetricCard
          title="Out of Stock"
          value="18"
          icon={AlertTriangle}
          trend={{ value: "5% from last month", isPositive: false }}
          variant="destructive"
        />
      </div>

      {/* Tabs for different report views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Inventory Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Trends</CardTitle>
                <CardDescription>Stock levels over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={inventoryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="inStock"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      name="In Stock"
                    />
                    <Line
                      type="monotone"
                      dataKey="lowStock"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                      name="Low Stock"
                    />
                    <Line
                      type="monotone"
                      dataKey="outOfStock"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      name="Out of Stock"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{product.revenue}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-success font-medium flex items-center justify-end gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {product.trend}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Cost</CardTitle>
              <CardDescription>Financial performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                  <Bar dataKey="cost" fill="hsl(var(--secondary))" name="Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Minimum Required</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.current}</TableCell>
                      <TableCell className="text-right">{item.minimum}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "Critical"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
