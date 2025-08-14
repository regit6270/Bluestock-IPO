import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search, Bell, ChevronDown, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import IPODashboardChart from "@/components/dashboard/ipo-dashboard-chart";
import QuickLinks from "@/components/dashboard/quick-links";
import MainIPOBoard from "@/components/dashboard/main-ipo-board";
import IPOTable from "@/components/ipo-table";
import LoadingScreen from "@/components/loading-screen";

type ViewMode = 'dashboard' | 'table';

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: dashboardStats } = useQuery<{
    total: number;
    upcoming: number;
    ongoing: number;
    newListed: number;
    closed: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
    enabled: !!user,
  });

  const handleNavigation = (mode: ViewMode) => {
    if (mode !== viewMode) {
      setIsLoading(true);
      setTimeout(() => {
        setViewMode(mode);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleRegisterIPO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation('/register-ipo');
    }, 1000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-bluestock-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-bluestock-primary to-bluestock-secondary rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              BLUESTOCK<span className="text-xs align-top">™</span> FinTech
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
                data-testid="input-header-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  data-testid="button-user-menu"
                >
                  <span className="hidden sm:block">Hi, {user?.username}</span>
                  <div className="w-8 h-8 bg-gradient-to-r from-bluestock-primary to-bluestock-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <nav className="p-6 space-y-2">
            <p className="text-xs font-semibold text-bluestock-gray uppercase tracking-wider mb-4">MENU</p>
            
            <Button
              variant={viewMode === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleNavigation('dashboard')}
              data-testid="button-nav-dashboard"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
            
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleNavigation('table')}
              data-testid="button-nav-manage-ipo"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Manage IPO
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="w-5 h-5 mr-3" />
              IPO Subscription
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="w-5 h-5 mr-3" />
              IPO Allotment
            </Button>

            <p className="text-xs font-semibold text-bluestock-gray uppercase tracking-wider mb-4 mt-8">OTHERS</p>
            
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              API Manager
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              Accounts
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              Help
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {viewMode === 'dashboard' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <Button
                  onClick={handleRegisterIPO}
                  className="bg-gradient-to-r from-bluestock-primary to-bluestock-secondary hover:from-bluestock-secondary hover:to-bluestock-primary"
                  data-testid="button-register-ipo"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register IPO
                </Button>
              </div>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* IPO Dashboard India */}
                <div className="lg:col-span-2">
                  <IPODashboardChart />
                </div>

                {/* Quick Links */}
                <div>
                  <QuickLinks />
                </div>
              </div>

              {/* Main IPO Board */}
              <MainIPOBoard stats={dashboardStats} />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage IPOs</h2>
                <Button
                  onClick={handleRegisterIPO}
                  className="bg-gradient-to-r from-bluestock-primary to-bluestock-secondary hover:from-bluestock-secondary hover:to-bluestock-primary"
                  data-testid="button-register-ipo-table"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register IPO
                </Button>
              </div>

              <IPOTable />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
