import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Settings, Menu, ClipboardList, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Inventory Ops", url: "/inventory", icon: ClipboardList },
  { title: "Categories", url: "/categories", icon: Menu },
  { title: "Reports", url: "/reports", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent className="pt-4">
        {/* Logo/Brand Section */}
        <div className={cn(
          "px-6 pb-6 flex items-center gap-3 transition-all duration-300",
          !open && "px-3 justify-center"
        )}>
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          {open && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg text-sidebar-foreground">InventoryPro</h1>
              <p className="text-xs text-muted-foreground">Manage with ease</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "px-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            !open && "px-3 text-center"
          )}>
            {open ? "Navigation" : "•"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "relative overflow-hidden",
                          isActive && "bg-primary text-primary-foreground font-medium shadow-sm"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={cn(
                            "h-5 w-5 shrink-0 transition-transform duration-200",
                            "group-hover:scale-110",
                            isActive && "text-primary-foreground"
                          )} />
                          {open && (
                            <>
                              <span className="flex-1 animate-fade-in">{item.title}</span>
                              {isActive && (
                                <ChevronRight className="h-4 w-4 animate-fade-in" />
                              )}
                            </>
                          )}
                          {isActive && (
                            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50",
          !open && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary-foreground">JD</span>
          </div>
          {open && (
            <div className="flex-1 animate-fade-in">
              <p className="text-sm font-medium text-sidebar-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
