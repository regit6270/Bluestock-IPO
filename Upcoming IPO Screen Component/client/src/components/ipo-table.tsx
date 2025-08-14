import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { IPO } from "@/lib/types";

interface IPOTableProps {
  ipos: IPO[];
  isLoading?: boolean;
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

export function IPOTable({ ipos, isLoading }: IPOTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteIPOMutation = useMutation({
    mutationFn: async (ipoId: string) => {
      await apiRequest('DELETE', `/api/ipos/${ipoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ipos'] });
      toast({
        title: "IPO Deleted",
        description: "IPO has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete IPO.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (ipoId: string) => {
    if (confirm("Are you sure you want to delete this IPO?")) {
      deleteIPOMutation.mutate(ipoId);
    }
  };

  const handleEdit = (ipo: IPO) => {
    // TODO: Open edit modal with IPO data
    toast({
      title: "Edit IPO",
      description: "Edit functionality will be implemented.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg" data-testid="ipo-table">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Open Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Close Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Band
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {ipos.map((ipo) => (
              <TableRow key={ipo.id} data-testid={`row-ipo-${ipo.id}`}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getLogoColor(ipo.logoColor)}`}>
                      <span className="font-bold text-sm">{ipo.logoInitials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900" data-testid={`text-company-name-${ipo.id}`}>
                        {ipo.companyName}
                      </div>
                      <div className="text-sm text-gray-500" data-testid={`text-sector-${ipo.id}`}>
                        {ipo.sector}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-open-date-${ipo.id}`}>
                  {formatDate(ipo.openDate)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-close-date-${ipo.id}`}>
                  {formatDate(ipo.closeDate)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-price-band-${ipo.id}`}>
                  ₹{ipo.minPrice} - ₹{ipo.maxPrice}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`text-xs font-medium rounded-full ${getStatusColor(ipo.status)}`} data-testid={`badge-status-${ipo.id}`}>
                    {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(ipo)}
                      className="text-bluestock-500 hover:text-bluestock-700 p-1"
                      data-testid={`button-edit-${ipo.id}`}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ipo.id)}
                      disabled={deleteIPOMutation.isPending}
                      className="text-red-500 hover:text-red-700 p-1"
                      data-testid={`button-delete-${ipo.id}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
