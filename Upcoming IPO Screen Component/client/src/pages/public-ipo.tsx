import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IPOSearch } from "@/components/ipo-search";
import { IPOCard } from "@/components/ipo-card";
import { FAQSection } from "@/components/faq-section";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { IPO } from "@/lib/types";

export default function PublicIPO() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ sector?: string; status?: string; dateRange?: string }>({});
  const [sortBy, setSortBy] = useState("latest");
  const { toast } = useToast();

  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('search', searchQuery);
  if (filters.sector && filters.sector !== 'all-sectors') queryParams.append('sector', filters.sector);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.dateRange && filters.dateRange !== 'all-dates') queryParams.append('dateRange', filters.dateRange);

  const { data: ipos = [], isLoading, error } = useQuery<IPO[]>({
    queryKey: ['/api/ipos', queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/ipos?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch IPOs');
      }
      return response.json();
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: { sector?: string; status?: string; dateRange?: string }) => {
    setFilters(newFilters);
  };

  const handleApply = (ipoId: string) => {
    // Show success toast
    toast({
      title: "Application Submitted",
      description: "Your IPO application has been submitted successfully. You will receive a confirmation email shortly.",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading IPOs</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <IPOSearch onSearch={handleSearch} onFilter={handleFilter} />

      {/* IPO Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming IPOs</h2>
              <p className="text-gray-600 mt-1" data-testid="text-ipo-count">
                {ipos.length} IPOs available for application
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="issue-size">Issue Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : ipos.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No IPOs Found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              {/* IPO Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-testid="ipo-grid">
                {ipos.map((ipo) => (
                  <IPOCard key={ipo.id} ipo={ipo} onApply={handleApply} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2" data-testid="pagination">
                <Button variant="outline" size="sm" data-testid="button-prev-page">
                  <ChevronLeft size={16} />
                </Button>
                <Button className="bg-bluestock-500 text-white" size="sm" data-testid="button-page-1">
                  1
                </Button>
                <Button variant="outline" size="sm" data-testid="button-page-2">
                  2
                </Button>
                <Button variant="outline" size="sm" data-testid="button-page-3">
                  3
                </Button>
                <span className="px-2 text-gray-500">...</span>
                <Button variant="outline" size="sm" data-testid="button-last-page">
                  10
                </Button>
                <Button variant="outline" size="sm" data-testid="button-next-page">
                  <ChevronRight size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <FAQSection />
      <Footer />
    </div>
  );
}
