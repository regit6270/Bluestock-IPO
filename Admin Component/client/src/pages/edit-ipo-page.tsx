import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ChevronRight, Upload, Trash2, Info, FileText } from "lucide-react";
import LoadingScreen from "@/components/loading-screen";
import type { Ipo } from "@shared/schema";

export default function EditIPOPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/edit-ipo/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch IPO data
  const { data: ipo, isLoading: ipoLoading } = useQuery<Ipo>({
    queryKey: ['/api/ipos', params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/ipos/${params?.id}`);
      if (!response.ok) throw new Error('Failed to fetch IPO');
      return response.json();
    },
    enabled: !!params?.id,
  });

  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: "",
    priceBand: "",
    openDate: "",
    closeDate: "",
    issueSize: "",
    issueType: "",
    listingDate: "",
    status: "",
    ipoPrice: "",
    listingPrice: "",
    listingGain: "",
    currentPrice: "",
    currentReturn: "",
    rhpLink: "",
    drhpLink: ""
  });

  const [originalData, setOriginalData] = useState(formData);

  // Initialize form data when IPO loads
  useEffect(() => {
    if (ipo) {
      const ipoData = {
        companyName: ipo.companyName || "",
        companyLogo: ipo.companyLogo || "",
        priceBand: ipo.priceBand || "",
        openDate: ipo.openDate || "",
        closeDate: ipo.closeDate || "",
        issueSize: ipo.issueSize || "",
        issueType: ipo.issueType || "",
        listingDate: ipo.listingDate || "",
        status: ipo.status || "",
        ipoPrice: ipo.ipoPrice?.toString() || "",
        listingPrice: ipo.listingPrice?.toString() || "",
        listingGain: ipo.listingGain || "",
        currentPrice: ipo.currentPrice?.toString() || "",
        currentReturn: ipo.currentReturn || "",
        rhpLink: ipo.rhpLink || "",
        drhpLink: ipo.drhpLink || ""
      };
      setFormData(ipoData);
      setOriginalData(ipoData);
    }
  }, [ipo]);

  const updateIPOMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PUT", `/api/ipos/${params?.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "IPO has been successfully updated.",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ipos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      handleNavigation('/');
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update IPO. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation(path);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    updateIPOMutation.mutate(formData);
  };

  const handleCancel = () => {
    // Reset to original data
    setFormData(originalData);
    handleNavigation('/');
  };

  if (isLoading || updateIPOMutation.isPending || ipoLoading) {
    return <LoadingScreen />;
  }

  if (!ipo) {
    return (
      <div className="min-h-screen bg-bluestock-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">IPO Not Found</h2>
          <Button onClick={() => handleNavigation('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
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
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-bluestock-gray">
              <span>Bluestock</span>
              <ChevronRight className="w-4 h-4" />
              <span>IPO</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-bluestock-primary font-medium">EDIT IPO</span>
            </nav>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <span className="hidden sm:block">Hi, {user?.username}</span>
              <div className="w-8 h-8 bg-gradient-to-r from-bluestock-primary to-bluestock-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <nav className="p-6 space-y-2">
            <p className="text-xs font-semibold text-bluestock-gray uppercase tracking-wider mb-4">MENU</p>
            
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation('/')}>
              <TrendingUp className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
            
            <Button variant="default" className="w-full justify-start">
              <TrendingUp className="w-5 h-5 mr-3" />
              Manage IPO
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              IPO Subscription
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
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
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Edit IPO Information</h2>
                <p className="text-bluestock-gray">Update IPO Details for {ipo.companyName}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  data-testid="button-cancel-edit-ipo"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-bluestock-primary to-bluestock-secondary hover:from-bluestock-secondary hover:to-bluestock-primary"
                  data-testid="button-update-ipo"
                >
                  Update
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Sidebar Menu */}
              <div className="w-80">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 text-bluestock-primary rounded-lg mb-4">
                      <div className="w-8 h-8 bg-bluestock-primary text-white rounded-full flex items-center justify-center">
                        <Info className="w-4 h-4" />
                      </div>
                      <span className="font-medium">IPO Information</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span>IPO Info</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Form Content */}
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle>IPO Information</CardTitle>
                    <CardDescription>Update IPO Details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form className="space-y-6">
                      {/* Company Logo Section */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-3 block">Company Logo</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {ipo.companyName?.charAt(0) || 'C'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Company Logo</p>
                              <p className="text-sm text-bluestock-gray">PNG/JPG format</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button type="button" size="sm" className="bg-bluestock-primary hover:bg-bluestock-secondary">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Logo
                            </Button>
                            <Button type="button" variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Form Fields - Same as register IPO but with pre-filled values */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            placeholder="Enter company name"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            data-testid="input-edit-company-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceBand">Price Band</Label>
                          <Input
                            id="priceBand"
                            placeholder="e.g., ₹100 - ₹120"
                            value={formData.priceBand}
                            onChange={(e) => handleInputChange('priceBand', e.target.value)}
                            data-testid="input-edit-price-band"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="openDate">Open Date</Label>
                          <Input
                            id="openDate"
                            type="date"
                            value={formData.openDate}
                            onChange={(e) => handleInputChange('openDate', e.target.value)}
                            data-testid="input-edit-open-date"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="closeDate">Close Date</Label>
                          <Input
                            id="closeDate"
                            type="date"
                            value={formData.closeDate}
                            onChange={(e) => handleInputChange('closeDate', e.target.value)}
                            data-testid="input-edit-close-date"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="issueSize">Issue Size</Label>
                          <Input
                            id="issueSize"
                            placeholder="e.g., 2300 Cr."
                            value={formData.issueSize}
                            onChange={(e) => handleInputChange('issueSize', e.target.value)}
                            data-testid="input-edit-issue-size"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="issueType">Issue Type</Label>
                          <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
                            <SelectTrigger data-testid="select-edit-issue-type">
                              <SelectValue placeholder="Select Issue Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="book-built">Book Built</SelectItem>
                              <SelectItem value="fixed-price">Fixed Price</SelectItem>
                              <SelectItem value="offer-for-sale">Offer for Sale</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="listingDate">Listing Date</Label>
                          <Input
                            id="listingDate"
                            type="date"
                            value={formData.listingDate}
                            onChange={(e) => handleInputChange('listingDate', e.target.value)}
                            data-testid="input-edit-listing-date"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                            <SelectTrigger data-testid="select-edit-status">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="new-listed">New Listed</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* NEW LISTED IPO DETAILS Section */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">NEW LISTED IPO DETAILS (WHEN IPO GET LISTED)</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="ipoPrice">IPO PRICE</Label>
                            <Input
                              id="ipoPrice"
                              placeholder="₹ 383"
                              value={formData.ipoPrice}
                              onChange={(e) => handleInputChange('ipoPrice', e.target.value)}
                              data-testid="input-edit-ipo-price"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="listingPrice">LISTING PRICE</Label>
                            <Input
                              id="listingPrice"
                              placeholder="₹ 435"
                              value={formData.listingPrice}
                              onChange={(e) => handleInputChange('listingPrice', e.target.value)}
                              data-testid="input-edit-listing-price"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="listingGain">LISTING GAIN</Label>
                            <Input
                              id="listingGain"
                              placeholder="13.58 %"
                              value={formData.listingGain}
                              onChange={(e) => handleInputChange('listingGain', e.target.value)}
                              data-testid="input-edit-listing-gain"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currentPrice">CURRENT PRICE</Label>
                            <Input
                              id="currentPrice"
                              placeholder="₹410"
                              value={formData.currentPrice}
                              onChange={(e) => handleInputChange('currentPrice', e.target.value)}
                              data-testid="input-edit-current-price"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentReturn">CURRENT RETURN</Label>
                            <Input
                              id="currentReturn"
                              placeholder="7.05 %"
                              value={formData.currentReturn}
                              onChange={(e) => handleInputChange('currentReturn', e.target.value)}
                              data-testid="input-edit-current-return"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rhpLink">RHP</Label>
                            <Input
                              id="rhpLink"
                              placeholder="Enter RHP PDF Link"
                              value={formData.rhpLink}
                              onChange={(e) => handleInputChange('rhpLink', e.target.value)}
                              data-testid="input-edit-rhp-link"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="drhpLink">DRHP</Label>
                            <Input
                              id="drhpLink"
                              placeholder="Enter DRHP PDF Link"
                              value={formData.drhpLink}
                              onChange={(e) => handleInputChange('drhpLink', e.target.value)}
                              data-testid="input-edit-drhp-link"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}