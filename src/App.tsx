import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import ProductForm from "./components/products/ProductForm";
import InventoryOperations from "./pages/InventoryOperations";

const queryClient = new QueryClient();

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col w-full">
            <Header />
            <main className="flex-1 p-6 animate-fade-in">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductForm mode="create" />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products/:id/edit" element={<ProductForm mode="edit" />} />
                <Route path="/inventory" element={<InventoryOperations />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
      <Sonner />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
