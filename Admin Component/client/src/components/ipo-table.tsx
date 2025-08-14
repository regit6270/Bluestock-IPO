import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import type { Ipo } from "@shared/schema";

export default function IPOTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: ipos = [], isLoading } = useQuery({
    queryKey: ['/api/ipos', { search: searchQuery, status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await fetch(`/api/ipos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch IPOs');
      return response.json();
    },
  });

  const deleteIPOMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/ipos/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "IPO deleted successfully",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ipos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to delete IPO",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (['IPO_CREATED', 'IPO_UPDATED', 'IPO_DELETED'].includes(message.type)) {
        queryClient.invalidateQueries({ queryKey: ['/api/ipos'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      }
    };

    return () => {
      socket.close();
    };
  }, [queryClient]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this IPO?')) {
      deleteIPOMutation.mutate(id);
    }
  };

  const handleUpdate = (id: string) => {
    setLocation(`/edit-ipo/${id}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'default';
      case 'upcoming':
        return 'secondary';
      case 'new-listed':
        return 'destructive';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'new-listed':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const paginatedIpos = ipos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(ipos.length / itemsPerPage);

  return (
    <Card>
      <CardContent className="p-0">
        {/* Search and Filter Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search IPOs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-ipos"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="select-status-filter">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="new-listed">New Listed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Company</TableHead>
                <TableHead>Price Band</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>Close</TableHead>
                <TableHead>Issue Size</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Listing Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bluestock-primary"></div>
                      <span className="ml-2">Loading IPOs...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedIpos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'No IPOs found matching your criteria' 
                        : 'No IPOs available'
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedIpos.map((ipo: Ipo) => (
                  <TableRow key={ipo.id} className="hover:bg-gray-50" data-testid={`row-ipo-${ipo.id}`}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{ipo.companyName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{ipo.priceBand || 'Not Available'}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{ipo.openDate || 'TBA'}</TableCell>
                    <TableCell className="text-sm text-gray-900">{ipo.closeDate || 'TBA'}</TableCell>
                    <TableCell className="text-sm text-gray-900">{ipo.issueSize || 'TBA'}</TableCell>
                    <TableCell className="text-sm text-gray-900">{ipo.issueType || 'TBA'}</TableCell>
                    <TableCell className="text-sm text-gray-900">{ipo.listingDate || 'TBA'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ipo.status)}`}>
                        {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          className="bg-bluestock-primary hover:bg-bluestock-secondary text-xs"
                          onClick={() => handleUpdate(ipo.id)}
                          data-testid={`button-update-${ipo.id}`}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(ipo.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          disabled={deleteIPOMutation.isPending}
                          data-testid={`button-delete-${ipo.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-800"
                          data-testid={`button-view-${ipo.id}`}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, ipos.length)} to {Math.min(currentPage * itemsPerPage, ipos.length)} of {ipos.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                data-testid="button-previous-page"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  data-testid={`button-page-${page}`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
