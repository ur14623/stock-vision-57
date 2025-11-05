import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface ProductFormProps {
  mode?: "create" | "edit";
  productId?: string;
}

const ProductForm = ({ mode = "create", productId }: ProductFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    brand: "",
    initialStock: 0,
    minStock: 5,
    costPrice: 0,
    sellPrice: 0,
    taxRate: "10",
    trackInventory: true,
    lowStockAlerts: true,
    allowBackorders: false,
  });

  const profitMargin = formData.sellPrice > 0
    ? (((formData.sellPrice - formData.costPrice) / formData.sellPrice) * 100).toFixed(1)
    : "0.0";
  const profit = (formData.sellPrice - formData.costPrice).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === "create" ? "Product Created" : "Product Updated",
      description: `${formData.name} has been ${mode === "create" ? "created" : "updated"} successfully.`,
    });
    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "create" ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create" ? "Create a new product entry" : "Update product information"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={4}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="computers">Computers</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Enter brand name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="initialStock">Initial Stock *</Label>
              <Input
                id="initialStock"
                type="number"
                value={formData.initialStock}
                onChange={(e) => setFormData({ ...formData, initialStock: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                required
              />
              <p className="text-xs text-muted-foreground">Units</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock Level</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                placeholder="5"
                min="0"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trackInventory"
                checked={formData.trackInventory}
                onCheckedChange={(checked) => setFormData({ ...formData, trackInventory: checked as boolean })}
              />
              <Label htmlFor="trackInventory" className="font-normal">Track Inventory</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowStockAlerts"
                checked={formData.lowStockAlerts}
                onCheckedChange={(checked) => setFormData({ ...formData, lowStockAlerts: checked as boolean })}
              />
              <Label htmlFor="lowStockAlerts" className="font-normal">Low Stock Alerts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowBackorders"
                checked={formData.allowBackorders}
                onCheckedChange={(checked) => setFormData({ ...formData, allowBackorders: checked as boolean })}
              />
              <Label htmlFor="allowBackorders" className="font-normal">Allow Backorders</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="pl-7"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellPrice">Selling Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="pl-7"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate</Label>
              <Select value={formData.taxRate} onValueChange={(value) => setFormData({ ...formData, taxRate: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Profit Analysis</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Margin:</span> {profitMargin}%
                </p>
                <p className="text-sm">
                  <span className="font-medium">Profit:</span> ${profit}/unit
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProductForm;
