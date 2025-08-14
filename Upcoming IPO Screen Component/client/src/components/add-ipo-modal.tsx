import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const ipoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  openDate: z.string().min(1, "Open date is required"),
  closeDate: z.string().min(1, "Close date is required"),
  minPrice: z.string().min(1, "Minimum price is required"),
  maxPrice: z.string().min(1, "Maximum price is required"),
  lotSize: z.string().min(1, "Lot size is required"),
  issueSize: z.string().min(1, "Issue size is required"),
  rhpLink: z.string().optional(),
  description: z.string().optional(),
  logoInitials: z.string().min(1, "Logo initials are required").max(3, "Maximum 3 characters"),
  logoColor: z.string().min(1, "Logo color is required"),
});

type IPOForm = z.infer<typeof ipoSchema>;

interface AddIPOModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddIPOModal({ open, onOpenChange }: AddIPOModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<IPOForm>({
    resolver: zodResolver(ipoSchema),
    defaultValues: {
      companyName: "",
      sector: "",
      openDate: "",
      closeDate: "",
      minPrice: "",
      maxPrice: "",
      lotSize: "",
      issueSize: "",
      rhpLink: "",
      description: "",
      logoInitials: "",
      logoColor: "blue",
    },
  });

  const createIPOMutation = useMutation({
    mutationFn: async (data: IPOForm) => {
      const formattedData = {
        ...data,
        openDate: new Date(data.openDate).toISOString(),
        closeDate: new Date(data.closeDate).toISOString(),
        lotSize: parseInt(data.lotSize),
      };
      
      const response = await apiRequest('POST', '/api/ipos', formattedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ipos'] });
      toast({
        title: "IPO Added Successfully",
        description: "New IPO has been added to the platform.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add IPO",
        description: error.message || "An error occurred while adding the IPO.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: IPOForm) => {
    createIPOMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto" data-testid="add-ipo-modal">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add New IPO
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company name" data-testid="input-company-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Sector */}
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-sector">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Defence">Defence</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Open Date */}
              <FormField
                control={form.control}
                name="openDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" data-testid="input-open-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Close Date */}
              <FormField
                control={form.control}
                name="closeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" data-testid="input-close-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price Band Min */}
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Band (Min)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="₹100" data-testid="input-min-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price Band Max */}
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Band (Max)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="₹110" data-testid="input-max-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Lot Size */}
              <FormField
                control={form.control}
                name="lotSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Size</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="100" data-testid="input-lot-size" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Issue Size */}
              <FormField
                control={form.control}
                name="issueSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Size (₹ Cr)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="500" data-testid="input-issue-size" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo Initials */}
              <FormField
                control={form.control}
                name="logoInitials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Initials</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ABC" maxLength={3} data-testid="input-logo-initials" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo Color */}
              <FormField
                control={form.control}
                name="logoColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Color</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-logo-color">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="teal">Teal</SelectItem>
                          <SelectItem value="gray">Gray</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* RHP Link */}
            <FormField
              control={form.control}
              name="rhpLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RHP Link</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://example.com/rhp-document.pdf" data-testid="input-rhp-link" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Company Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Brief description of the company..." data-testid="textarea-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createIPOMutation.isPending}
                className="bg-bluestock-500 hover:bg-bluestock-600"
                data-testid="button-add-ipo"
              >
                {createIPOMutation.isPending ? "Adding..." : "Add IPO"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
