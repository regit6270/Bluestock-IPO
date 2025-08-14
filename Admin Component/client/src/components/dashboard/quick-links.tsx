import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const quickLinks = [
  {
    name: "NSE India",
    code: "NSE",
    color: "bg-blue-500",
    url: "https://www.nseindia.com"
  },
  {
    name: "BSE India", 
    code: "BSE",
    color: "bg-red-500",
    url: "https://www.bseindia.com"
  },
  {
    name: "SEBI",
    code: "SEBI", 
    color: "bg-green-500",
    url: "https://www.sebi.gov.in"
  },
  {
    name: "Money Control",
    code: "MC",
    color: "bg-orange-500",
    url: "https://www.moneycontrol.com"
  }
];

export default function QuickLinks() {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickLinks.map((link) => (
            <div 
              key={link.code}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleLinkClick(link.url)}
              data-testid={`quick-link-${link.code.toLowerCase()}`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center mr-3`}>
                  <span className="text-white font-bold text-sm">{link.code}</span>
                </div>
                <span className="font-medium text-gray-800">{link.name}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
