import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CategoryStats } from "@/components/categories/CategoryStats";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { CategoryForm, CategoryFormData } from "@/components/categories/CategoryForm";
import { DeleteCategoryDialog, DeleteOptions } from "@/components/categories/DeleteCategoryDialog";
import { Plus, Search, Grid, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockCategories = [
  {
    id: "1",
    name: "Electronics",
    productCount: 156,
    subcategoryCount: 4,
    inventoryValue: 45230,
    parent: "Root Category",
    status: "active" as const,
    visibility: "Public",
    subcategories: [
      { name: "Computers", count: 45 },
      { name: "Mobile", count: 18 },
      { name: "Audio", count: 11 },
      { name: "Accessories", count: 32 },
    ],
  },
  {
    id: "2",
    name: "Clothing",
    productCount: 89,
    subcategoryCount: 3,
    inventoryValue: 12450,
    parent: "Root Category",
    status: "active" as const,
    visibility: "Public",
    subcategories: [
      { name: "Men", count: 25 },
      { name: "Women", count: 18 },
      { name: "Kids", count: 2 },
    ],
  },
  {
    id: "3",
    name: "Furniture",
    productCount: 34,
    subcategoryCount: 2,
    inventoryValue: 23100,
    parent: "Root Category",
    status: "active" as const,
    visibility: "Public",
    subcategories: [
      { name: "Indoor", count: 20 },
      { name: "Outdoor", count: 14 },
    ],
  },
  {
    id: "4",
    name: "Seasonal",
    productCount: 0,
    subcategoryCount: 0,
    inventoryValue: 0,
    parent: "Root Category",
    status: "inactive" as const,
    visibility: "Hidden",
    subcategories: [],
  },
];

const Categories = () => {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmpty, setShowEmpty] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: typeof mockCategories[0] | null;
  }>({ open: false, category: null });

  const filteredCategories = mockCategories.filter((cat) => {
    if (!showEmpty && cat.productCount === 0) return false;
    if (!showInactive && cat.status === "inactive") return false;
    if (searchTerm && !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalStats = {
    totalCategories: mockCategories.length,
    totalProducts: mockCategories.reduce((sum, cat) => sum + cat.productCount, 0),
    totalSubcategories: mockCategories.reduce((sum, cat) => sum + cat.subcategoryCount, 0),
    maxDepth: 4,
  };

  const handleCreateCategory = () => {
    setFormMode("create");
    setCurrentView("form");
  };

  const handleEditCategory = () => {
    setFormMode("edit");
    setCurrentView("form");
  };

  const handleDeleteCategory = (category: typeof mockCategories[0]) => {
    setDeleteDialog({ open: true, category });
  };

  const handleConfirmDelete = (options: DeleteOptions) => {
    toast({
      title: "Category deleted",
      description: `${deleteDialog.category?.name} has been deleted successfully.`,
    });
    setDeleteDialog({ open: false, category: null });
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    toast({
      title: formMode === "create" ? "Category created" : "Category updated",
      description: `${data.name} has been ${formMode === "create" ? "created" : "updated"} successfully.`,
    });
    setCurrentView("list");
  };

  const handleFormCancel = () => {
    setCurrentView("list");
  };

  if (currentView === "form") {
    return (
      <div className="space-y-6">
        <CategoryForm mode={formMode} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      </div>
    );
  }

  if (filteredCategories.length === 0 && mockCategories.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg">
          <div className="text-center space-y-4 p-8">
            <div className="text-6xl">📁</div>
            <h2 className="text-2xl font-semibold">No Categories Yet</h2>
            <p className="text-muted-foreground max-w-md">
              You haven't created any categories yet. Organize your products with categories to make inventory
              management easier.
            </p>
            <Button onClick={handleCreateCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Category
            </Button>
            <div className="mt-6 text-left bg-muted/50 rounded-lg p-4 max-w-md">
              <div className="font-semibold mb-2">💡 Tip: Categories help you:</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Organize products logically</li>
                <li>• Generate better reports</li>
                <li>• Improve customer browsing</li>
                <li>• Set category-specific pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Organize and manage your product categories</p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryStats {...totalStats} />

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="name-asc">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort: A-Z" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
              <SelectItem value="products-desc">Most Products</SelectItem>
              <SelectItem value="products-asc">Least Products</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="showEmpty" checked={showEmpty} onCheckedChange={(checked) => setShowEmpty(checked as boolean)} />
            <Label htmlFor="showEmpty">Show Empty Categories</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showInactive"
              checked={showInactive}
              onCheckedChange={(checked) => setShowInactive(checked as boolean)}
            />
            <Label htmlFor="showInactive">Show Inactive</Label>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
              onEdit={handleEditCategory}
              onDelete={() => handleDeleteCategory(category)}
            />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Subs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.productCount}</TableCell>
                <TableCell>{category.subcategoryCount}</TableCell>
                <TableCell>
                  <Badge variant={category.status === "active" ? "success" : "destructive"}>
                    {category.status === "active" ? "🟢" : "🔴"} {category.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleEditCategory}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {deleteDialog.category && (
        <DeleteCategoryDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, category: null })}
          categoryName={deleteDialog.category.name}
          productCount={deleteDialog.category.productCount}
          subcategoryCount={deleteDialog.category.subcategoryCount}
          inventoryValue={deleteDialog.category.inventoryValue}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Categories;
