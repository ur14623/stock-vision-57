import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  productCount: number;
  subcategoryCount: number;
  inventoryValue: number;
  onConfirm: (options: DeleteOptions) => void;
}

export interface DeleteOptions {
  productAction: "move" | "delete";
  targetCategory?: string;
  subcategoryAction: "move" | "delete";
}

export const DeleteCategoryDialog = ({
  open,
  onOpenChange,
  categoryName,
  productCount,
  subcategoryCount,
  inventoryValue,
  onConfirm,
}: DeleteCategoryDialogProps) => {
  const [productAction, setProductAction] = useState<"move" | "delete">("move");
  const [targetCategory, setTargetCategory] = useState<string>("");
  const [subcategoryAction, setSubcategoryAction] = useState<"move" | "delete">("move");

  const handleConfirm = () => {
    onConfirm({
      productAction,
      targetCategory: productAction === "move" ? targetCategory : undefined,
      subcategoryAction,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            🚨 You are about to delete: <strong>"{categoryName}"</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="font-semibold mb-2">📊 Category Impact Summary:</div>
            <ul className="space-y-1 text-sm">
              <li>• {productCount} products</li>
              <li>• {subcategoryCount} subcategories</li>
              <li>• ${inventoryValue.toLocaleString()} inventory value</li>
            </ul>
          </div>

          {productCount > 0 && (
            <div className="space-y-3">
              <Label className="font-semibold">⚠️ Product Handling:</Label>
              <RadioGroup value={productAction} onValueChange={(value) => setProductAction(value as "move" | "delete")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="move" id="move-products" />
                  <Label htmlFor="move-products">Move all products to another category</Label>
                </div>
                {productAction === "move" && (
                  <div className="ml-6">
                    <Select value={targetCategory} onValueChange={setTargetCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delete" id="delete-products" />
                  <Label htmlFor="delete-products" className="text-destructive">
                    Delete all products permanently
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {subcategoryCount > 0 && (
            <div className="space-y-3">
              <Label className="font-semibold">Subcategory Handling:</Label>
              <RadioGroup
                value={subcategoryAction}
                onValueChange={(value) => setSubcategoryAction(value as "move" | "delete")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="move" id="move-subcats" />
                  <Label htmlFor="move-subcats">Move subcategories to parent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delete" id="delete-subcats" />
                  <Label htmlFor="delete-subcats" className="text-destructive">
                    Delete subcategories and their products
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm">
            ❗ This action cannot be undone!
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive hover:bg-destructive/90">
            Confirm Deletion
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
