import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import type { IPO } from "@/lib/types";

interface IPOCardProps {
  ipo: IPO;
  onApply?: (ipoId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700';
    case 'open':
      return 'bg-green-100 text-green-700';
    case 'closed':
      return 'bg-gray-100 text-gray-700';
    case 'listed':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getLogoColor = (color: string) => {
  const colorMap: Record<string, string> = {
    'blue': 'bg-blue-100 text-blue-600',
    'green': 'bg-green-100 text-green-600',
    'orange': 'bg-orange-100 text-orange-600',
    'purple': 'bg-purple-100 text-purple-600',
    'red': 'bg-red-100 text-red-600',
    'teal': 'bg-teal-100 text-teal-600',
    'gray': 'bg-gray-100 text-gray-600',
  };
  return colorMap[color] || 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatPrice = (price: string) => {
  return `₹${price}`;
};

export function IPOCard({ ipo, onApply }: IPOCardProps) {
  const displayMinPrice = ipo.minPrice === "0" ? "Not Issued" : formatPrice(ipo.minPrice);
  const displayMaxPrice = ipo.maxPrice === "0" ? "Not Issued" : formatPrice(ipo.maxPrice);
  const displayIssueSize = ipo.issueSize === "0" ? "Not Issued" : `₹${ipo.issueSize} Cr`;
  const displayPriceBand = ipo.minPrice === "0" && ipo.maxPrice === "0" ? "Not Issued" : `${displayMinPrice} - ${displayMaxPrice}`;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
      data-testid={`card-ipo-${ipo.id}`}
    >
      <div className="p-4">
        {/* Company Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getLogoColor(ipo.logoColor)}`}>
              <span className="font-bold text-sm" data-testid={`text-logo-${ipo.id}`}>
                {ipo.logoInitials}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 text-sm leading-tight" data-testid={`text-company-${ipo.id}`}>
                {ipo.companyName}
              </h3>
            </div>
          </div>
          <Badge className={`text-xs font-medium rounded px-2 py-1 ${getStatusColor(ipo.status)}`} data-testid={`badge-status-${ipo.id}`}>
            {ipo.status === 'ongoing' ? 'Ongoing' : ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
          </Badge>
        </div>
        
        {/* IPO Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs">
          <div>
            <span className="text-gray-600 font-medium">PRICE BAND</span>
            <div className="text-gray-900 font-semibold" data-testid={`text-price-band-${ipo.id}`}>
              {displayPriceBand}
            </div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">OPEN</span>
            <div className="text-gray-900 font-semibold" data-testid={`text-open-date-${ipo.id}`}>
              {formatDate(ipo.openDate)}
            </div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">LOT SIZE</span>
            <div className="text-gray-900 font-semibold" data-testid={`text-lot-size-${ipo.id}`}>
              {ipo.lotSize}
            </div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">CLOSE</span>
            <div className="text-gray-900 font-semibold" data-testid={`text-close-date-${ipo.id}`}>
              {formatDate(ipo.closeDate)}
            </div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">ISSUE TYPE</span>
            <div className="text-gray-900 font-semibold">Book Built</div>
          </div>
          <div>
            <span className="text-gray-600 font-medium">LISTING DATE</span>
            <div className="text-gray-900 font-semibold">{displayIssueSize}</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-medium"
            data-testid={`button-rhp-${ipo.id}`}
          >
            RHP
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium"
            data-testid={`button-drhp-${ipo.id}`}
          >
            DRHP
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
            onClick={() => onApply?.(ipo.id)}
            data-testid={`button-apply-${ipo.id}`}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
