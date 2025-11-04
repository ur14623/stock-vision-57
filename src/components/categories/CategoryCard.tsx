import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Plus, BarChart, Download, Trash } from "lucide-react";

interface CategoryCardProps {
  name: string;
  productCount: number;
  subcategoryCount: number;
  inventoryValue: number;
  parent: string;
  status: "active" | "inactive";
  visibility: string;
  subcategories?: Array<{ name: string; count: number }>;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onAddSubcategory?: () => void;
  onDelete?: () => void;
}

export const CategoryCard = ({
  name,
  productCount,
  subcategoryCount,
  inventoryValue,
  parent,
  status,
  visibility,
  subcategories = [],
  onViewDetails,
  onEdit,
  onAddSubcategory,
  onDelete,
}: CategoryCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddSubcategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subcategory
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BarChart className="mr-2 h-4 w-4" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export Products
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-sm">
          <span>📁 Products: {productCount}</span>
          <span>📂 Subcategories: {subcategoryCount}</span>
        </div>
        <div className="text-sm">📊 Inventory Value: ${inventoryValue.toLocaleString()}</div>
        <div className="text-sm">🏷️ Parent: {parent}</div>
        <div className="flex items-center gap-2">
          <Badge variant={status === "active" ? "success" : "destructive"}>
            {status === "active" ? "🟢" : "🔴"} {status}
          </Badge>
          <Badge variant="outline">👁️ {visibility}</Badge>
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Subcategories:</div>
          <div className="grid grid-cols-2 gap-2">
            {subcategories.map((sub, index) => (
              <div key={index} className="bg-muted/50 rounded p-2 text-center text-sm">
                <div className="font-medium">{sub.name}</div>
                <div className="text-muted-foreground">({sub.count})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onAddSubcategory} className="flex-1">
          Add Subcategory
        </Button>
      </div>
    </Card>
  );
};
