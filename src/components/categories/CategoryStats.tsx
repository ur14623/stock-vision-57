import { Card } from "@/components/ui/card";

interface CategoryStatsProps {
  totalCategories: number;
  totalProducts: number;
  totalSubcategories: number;
  maxDepth: number;
}

export const CategoryStats = ({
  totalCategories,
  totalProducts,
  totalSubcategories,
  maxDepth,
}: CategoryStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Total Categories</div>
        <div className="text-3xl font-bold">{totalCategories}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Total Products</div>
        <div className="text-3xl font-bold">{totalProducts.toLocaleString()}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Subcategories</div>
        <div className="text-3xl font-bold">{totalSubcategories}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Max Depth</div>
        <div className="text-3xl font-bold">{maxDepth}</div>
      </Card>
    </div>
  );
};
