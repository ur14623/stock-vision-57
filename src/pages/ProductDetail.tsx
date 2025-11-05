import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Package, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface StockMovement {
  id: string;
  date: string;
  type: string;
  quantity: number;
  user: string;
  notes: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock product data
  const product = {
    id: id,
    name: "Wireless Mouse Pro",
    sku: "WM-PRO-001",
    category: "Electronics > Computers",
    supplier: "TechSupplies Inc.",
    stock: 45,
    minStock: 10,
    costPrice: 15.0,
    sellPrice: 29.99,
    lastUpdated: "2024-01-15",
    image: "/placeholder.svg",
  };

  const stockMovements: StockMovement[] = [
    { id: "1", date: "2024-01-15", type: "Sale", quantity: -2, user: "John", notes: "Online Order" },
    { id: "2", date: "2024-01-14", type: "Restock", quantity: 50, user: "Sarah", notes: "Supplier PO#123" },
    { id: "3", date: "2024-01-10", type: "Adjustment", quantity: -3, user: "System", notes: "Damaged Return" },
  ];

  const getStockStatus = () => {
    if (product.stock === 0) return { label: "Out of Stock", variant: "destructive" as const, color: "bg-destructive" };
    if (product.stock <= product.minStock) return { label: "Low Stock", variant: "warning" as const, color: "bg-warning" };
    return { label: "In Stock", variant: "success" as const, color: "bg-success" };
  };

  const profitMargin = ((product.sellPrice - product.costPrice) / product.sellPrice * 100).toFixed(1);
  const profit = (product.sellPrice - product.costPrice).toFixed(2);
  const status = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
            <p className="text-muted-foreground">{product.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/products/${id}/edit`)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
              <Button variant="outline" className="w-full">Upload Image</Button>
              <Button variant="ghost" className="w-full">View Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information & Inventory Status */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                <p className="text-base font-medium">{product.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">SKU</label>
                <p className="text-base font-medium">{product.sku}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p className="text-base font-medium">{product.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                <p className="text-base font-medium">{product.supplier}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock Level</label>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{product.stock}</p>
                    <span className="text-sm text-muted-foreground">units</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Minimum Level</label>
                  <p className="text-2xl font-bold">{product.minStock} <span className="text-sm font-normal text-muted-foreground">units</span></p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all", status.color)}
                    style={{ width: `${Math.min((product.stock / (product.minStock * 3)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{product.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${product.costPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Sell Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${product.sellPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profitMargin}%</p>
            <p className="text-sm text-muted-foreground">${profit} per unit</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell className={cn("font-medium", movement.quantity > 0 ? "text-success" : "text-destructive")}>
                    {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                  </TableCell>
                  <TableCell>{movement.user}</TableCell>
                  <TableCell className="text-muted-foreground">{movement.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
