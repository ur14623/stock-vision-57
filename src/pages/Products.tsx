import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
}

const mockProducts: Product[] = [
  { id: "1", name: "Wireless Mouse", sku: "WM-001", category: "Electronics", stock: 145, minStock: 20, price: 29.99 },
  { id: "2", name: "USB Cable Type-C", sku: "UC-002", category: "Accessories", stock: 5, minStock: 50, price: 9.99 },
  { id: "3", name: "Laptop Stand", sku: "LS-003", category: "Furniture", stock: 78, minStock: 15, price: 49.99 },
  { id: "4", name: "Mechanical Keyboard", sku: "MK-004", category: "Electronics", stock: 0, minStock: 10, price: 89.99 },
  { id: "5", name: "Monitor 27\"", sku: "MN-005", category: "Electronics", stock: 32, minStock: 5, price: 299.99 },
  { id: "6", name: "Desk Lamp LED", sku: "DL-006", category: "Lighting", stock: 120, minStock: 25, price: 34.99 },
];

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= minStock) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  const getStockBarWidth = (stock: number, minStock: number) => {
    const percentage = Math.min((stock / (minStock * 3)) * 100, 100);
    return `${percentage}%`;
  };

  const getStockBarColor = (stock: number, minStock: number) => {
    if (stock === 0) return "bg-destructive";
    if (stock <= minStock) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/products/new")}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => {
              const status = getStockStatus(product.stock, product.minStock);
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{product.stock}</span>
                        <span className="text-xs text-muted-foreground">
                          / {product.minStock} min
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all", getStockBarColor(product.stock, product.minStock))}
                          style={{ width: getStockBarWidth(product.stock, product.minStock) }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${product.price}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;
