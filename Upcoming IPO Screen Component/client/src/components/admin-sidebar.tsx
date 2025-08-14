import { ChartLine, BarChart3, Building, Users, Shuffle, Settings, Code, UserCircle, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { removeToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard", active: true },
  { icon: Building, label: "Manage IPO", href: "/admin/ipos" },
  { icon: Users, label: "IPO Subscription", href: "/admin/subscriptions" },
  { icon: Shuffle, label: "IPO Allotment", href: "/admin/allotment" },
];

const otherItems = [
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: Code, label: "API Manager", href: "/admin/api" },
  { icon: UserCircle, label: "Accounts", href: "/admin/accounts" },
  { icon: HelpCircle, label: "Help", href: "/admin/help" },
];

export function AdminSidebar() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    removeToken();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation('/');
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed" data-testid="admin-sidebar">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-bluestock-500 to-orange-500 rounded-lg flex items-center justify-center">
            <ChartLine className="text-white" size={16} />
          </div>
          <span className="text-xl font-bold text-gray-900">Bluestock</span>
          <span className="text-xs text-gray-500">Fintech</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            MENU
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active
                    ? "bg-bluestock-50 text-bluestock-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setLocation(item.href)}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">
            OTHERS
          </div>
          
          {otherItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors"
                onClick={() => setLocation(item.href)}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </nav>
      </div>
    </aside>
  );
}
