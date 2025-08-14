import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IPOSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { sector?: string; status?: string; dateRange?: string }) => void;
}

export function IPOSearch({ onSearch, onFilter }: IPOSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sector, setSector] = useState("all-sectors");
  const [dateRange, setDateRange] = useState("all-dates");

  const handleSearch = () => {
    onSearch(searchQuery);
    onFilter({ sector, dateRange });
  };

  return (
    <section className="bg-gradient-to-r from-bluestock-50 to-blue-50 py-12" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming IPO
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Apply for the best IPOs and get guaranteed allotment. Start investing in upcoming companies today.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search company name..."
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluestock-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              
              {/* Date Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluestock-500" data-testid="select-date">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-dates">All Dates</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="next-month">Next Month</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Sector Filter */}
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bluestock-500" data-testid="select-sector">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sectors">All Sectors</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Defence">Defence</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="px-8 py-3 bg-bluestock-500 text-white font-medium rounded-lg hover:bg-bluestock-600 transition-colors"
                data-testid="button-filter"
              >
                <Filter className="mr-2" size={20} />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
