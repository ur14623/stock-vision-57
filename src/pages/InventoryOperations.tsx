import { useState } from "react";
import { Package, TrendingDown, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const InventoryOperations = () => {
  const [operationType, setOperationType] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const stats = [
    { label: "Total Items", value: "1,247", icon: Package },
    { label: "Low Stock", value: "23", icon: TrendingDown },
    { label: "Out of Stock", value: "5", icon: AlertTriangle },
    { label: "Today's Moves", value: "47", icon: Activity },
  ];

  const recentAdjustments = [
    { date: "2024-01-15", product: "Wireless Mouse Pro", type: "+Add", qty: 50, user: "Sarah" },
    { date: "2024-01-14", product: "Keyboard RGB", type: "-Remove", qty: 2, user: "John" },
    { date: "2024-01-13", product: "Mousepad Large", type: "+Add", qty: 25, user: "System" },
  ];

  const handleAdjustment = () => {
    if (!selectedProduct || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Stock Adjusted",
      description: `Stock ${operationType === "add" ? "added" : "removed"} successfully`,
    });

    // Reset form
    setSelectedProduct("");
    setQuantity("");
    setReason("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Operations</h1>
        <p className="text-muted-foreground">Manage stock adjustments, transfers, and counts</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Operations Tabs */}
      <Tabs defaultValue="adjust" className="space-y-6">
        <TabsList>
          <TabsTrigger value="adjust">Stock Adjust</TabsTrigger>
          <TabsTrigger value="transfer">Stock Transfer</TabsTrigger>
          <TabsTrigger value="count">Stock Count</TabsTrigger>
        </TabsList>

        {/* Stock Adjustment Tab */}
        <TabsContent value="adjust" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Adjustment Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Operation Type</Label>
                <RadioGroup value={operationType} onValueChange={setOperationType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add" />
                    <Label htmlFor="add" className="font-normal">Add Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove" />
                    <Label htmlFor="remove" className="font-normal">Remove Stock</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product Selection *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search or select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wm-001">Wireless Mouse Pro (WM-PRO-001)</SelectItem>
                    <SelectItem value="kb-002">Mechanical Keyboard (KB-002)</SelectItem>
                    <SelectItem value="mp-003">Gaming Mousepad (MP-003)</SelectItem>
                  </SelectContent>
                </Select>
                {selectedProduct && (
                  <p className="text-sm text-muted-foreground">
                    Current Stock: 45 units | Min: 10 units
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">units</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restock">Restock</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about this adjustment"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdjustment}>Apply Adjustment</Button>
                <Button variant="outline">Preview Slip</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Adjustments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Adjustments (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAdjustments.map((adj, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{adj.date}</TableCell>
                      <TableCell>{adj.product}</TableCell>
                      <TableCell>{adj.type}</TableCell>
                      <TableCell>{adj.qty}</TableCell>
                      <TableCell>{adj.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Transfer Tab */}
        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Stock Transfer Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromLocation">From Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="store">Store Front</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toLocation">To Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="store">Store Front</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Search product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wm-001">Wireless Mouse Pro</SelectItem>
                    <SelectItem value="kb-002">Mechanical Keyboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferQty">Quantity</Label>
                <Input id="transferQty" type="number" placeholder="0" min="0" />
              </div>
              <div className="flex gap-2">
                <Button>Initiate Transfer</Button>
                <Button variant="outline">Generate Transfer Slip</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Count Tab */}
        <TabsContent value="count">
          <Card>
            <CardHeader>
              <CardTitle>Stock Count (Physical Count)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Count Session</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Count - Jan 2024</SelectItem>
                      <SelectItem value="monthly">Monthly Count - Jan 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Main Warehouse</SelectItem>
                      <SelectItem value="store">Store Front</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Status:</span> In Progress | 
                  <span className="font-medium"> Counted:</span> 45/1,247 items
                </p>
              </div>
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Product Count Interface</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Product:</span> Wireless Mouse Pro
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-xs">Expected</Label>
                      <p className="text-lg font-semibold">45</p>
                    </div>
                    <div>
                      <Label htmlFor="counted" className="text-xs">Counted</Label>
                      <Input id="counted" type="number" placeholder="0" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">Variance</Label>
                      <p className="text-lg font-semibold text-destructive">-2</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countNotes" className="text-xs">Notes</Label>
                    <Textarea id="countNotes" placeholder="Found 2 damaged units" rows={2} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Save & Next</Button>
                    <Button size="sm" variant="outline">Skip</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryOperations;
