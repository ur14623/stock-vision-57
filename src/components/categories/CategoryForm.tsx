import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Upload } from "lucide-react";

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parent: string;
  description: string;
  status: "active" | "inactive";
  visibility: "public" | "hidden" | "staff-only";
  allowProducts: boolean;
  allowSubcategories: boolean;
  metaTitle: string;
  metaDescription: string;
  displayOrder: number;
  displayTemplate: string;
  featured: boolean;
  image?: string;
}

export const CategoryForm = ({ mode, initialData, onSubmit, onCancel }: CategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || {
      name: "",
      slug: "",
      parent: "root",
      description: "",
      status: "active",
      visibility: "public",
      allowProducts: true,
      allowSubcategories: true,
      metaTitle: "",
      metaDescription: "",
      displayOrder: 0,
      displayTemplate: "default",
      featured: false,
    }
  );

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{mode === "create" ? "Create New Category" : "Edit Category"}</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Category</Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">● Basic Info</TabsTrigger>
          <TabsTrigger value="settings">○ Settings</TabsTrigger>
          <TabsTrigger value="seo">○ SEO</TabsTrigger>
          <TabsTrigger value="display">○ Display</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mobile Accessories"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="mobile-accessories"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground">URL-friendly version of name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select value={formData.parent} onValueChange={(value) => setFormData({ ...formData, parent: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Root Category</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Select parent or leave as root</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this category and its products..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">Max 500 characters</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Status & Access</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="inactive" />
                      <Label htmlFor="inactive">Inactive</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <RadioGroup
                    value={formData.visibility}
                    onValueChange={(value) =>
                      setFormData({ ...formData, visibility: value as "public" | "hidden" | "staff-only" })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hidden" id="hidden" />
                      <Label htmlFor="hidden">Hidden</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="staff-only" id="staff-only" />
                      <Label htmlFor="staff-only">Staff Only</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowProducts"
                      checked={formData.allowProducts}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowProducts: checked as boolean })}
                    />
                    <Label htmlFor="allowProducts">Allow Products</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowSubcategories"
                      checked={formData.allowSubcategories}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allowSubcategories: checked as boolean })
                      }
                    />
                    <Label htmlFor="allowSubcategories">Allow Subcategories</Label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Category Image</h3>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm">Drag & drop image or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-2">Recommended: 400×300px</p>
                  <p className="text-xs text-muted-foreground">Format: JPG, PNG, WebP</p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="Optional - for SEO"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="Optional - for search engines"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">Higher numbers display first</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayTemplate">Display Template</Label>
              <Select
                value={formData.displayTemplate}
                onValueChange={(value) => setFormData({ ...formData, displayTemplate: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="grid">Grid Template</SelectItem>
                  <SelectItem value="list">List Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
              />
              <Label htmlFor="featured">Featured Category</Label>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};
