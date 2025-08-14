import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Bell, Plus, ArrowUp, ExternalLink } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AddIPOModal } from "@/components/add-ipo-modal";
import { IPOTable } from "@/components/ipo-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { isAuthenticated, isAdmin, getUser } from "@/lib/auth";
import type { IPO, DashboardStats } from "@/lib/types";

export default function AdminDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      toast({
        title: "Access Denied",
        description: "Please login as an admin to access this page.",
        variant: "destructive",
      });
      setLocation('/admin/login');
    }
  }, [setLocation, toast]);

  const user = getUser();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated() && isAdmin(),
  });

  const { data: ipos = [], isLoading: iposLoading } = useQuery<IPO[]>({
    queryKey: ['/api/ipos'],
    enabled: isAuthenticated() && isAdmin(),
  });

  if (!isAuthenticated() || !isAdmin()) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 flex" data-testid="admin-dashboard">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4" data-testid="dashboard-header">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.username || 'Admin'}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluestock-500 focus:border-transparent w-64"
                  data-testid="input-search"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-2" data-testid="user-menu">
                <div className="w-8 h-8 bg-bluestock-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Hi, {user?.username || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* IPO Dashboard India Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">IPO Dashboard India</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <ArrowUp className="text-green-500" size={20} />
                  <span className="text-green-500 font-medium" data-testid="text-ipos-in-gain">
                    {statsLoading ? "..." : `${stats?.upcomingIpos || 0} IPO in Gain`}
                  </span>
                </div>
                
                {/* Chart placeholder - TODO: Implement with Chart.js */}
                <div className="flex items-end justify-center space-x-2 h-32" data-testid="chart-dashboard">
                  <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    <div className="text-center">
                      <div>{stats?.upcomingIpos || 0}</div>
                      <div className="text-xs">Upcoming</div>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    <div className="text-center">
                      <div>{stats?.totalIpos || 0}</div>
                      <div className="text-xs">Total</div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    <div className="text-center">
                      <div>{stats?.closedIpos || 0}</div>
                      <div className="text-xs">Closed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Quick access to important resources</p>
                
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-xs">NSE</span>
                      </div>
                      <span className="font-medium text-gray-900">NSE India</span>
                    </div>
                    <ExternalLink className="text-bluestock-500" size={16} />
                  </a>
                  
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">BSE</span>
                      </div>
                      <span className="font-medium text-gray-900">BSE India</span>
                    </div>
                    <ExternalLink className="text-bluestock-500" size={16} />
                  </a>
                  
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-xs">SEBI</span>
                      </div>
                      <span className="font-medium text-gray-900">SEBI</span>
                    </div>
                    <ExternalLink className="text-bluestock-500" size={16} />
                  </a>
                  
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">MC</span>
                      </div>
                      <span className="font-medium text-gray-900">Money Control</span>
                    </div>
                    <ExternalLink className="text-bluestock-500" size={16} />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Main Board IPO Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-gray-900">Main Board IPO</CardTitle>
                  <Button variant="ghost" size="sm" className="text-bluestock-500">
                    View Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">From 01 Jan 2024</p>
                
                {/* Progress indicator - TODO: Implement proper donut chart */}
                <div className="relative mb-6" data-testid="chart-main-board">
                  <div className="w-24 h-24 mx-auto">
                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                      <div className="absolute inset-0 rounded-full border-8 border-bluestock-500 border-r-transparent transform rotate-45"></div>
                      <div className="absolute inset-4 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{stats?.totalIpos || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Upcoming</span>
                    </div>
                    <span className="font-medium" data-testid="text-upcoming-count">
                      {stats?.upcomingIpos || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span>Listed</span>
                    </div>
                    <span className="font-medium" data-testid="text-listed-count">
                      {stats?.listedIpos || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Open</span>
                    </div>
                    <span className="font-medium" data-testid="text-open-count">
                      {stats?.openIpos || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* IPO Management Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">IPO Management</CardTitle>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-bluestock-500 hover:bg-bluestock-600"
                  data-testid="button-add-ipo"
                >
                  <Plus size={16} className="mr-2" />
                  Add New IPO
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <IPOTable ipos={ipos} isLoading={iposLoading} />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add IPO Modal */}
      <AddIPOModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
    </div>
  );
}
