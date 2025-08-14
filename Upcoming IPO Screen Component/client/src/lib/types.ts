export interface IPO {
  id: string;
  companyName: string;
  sector: string;
  openDate: string;
  closeDate: string;
  minPrice: string;
  maxPrice: string;
  lotSize: number;
  issueSize: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  rhpLink?: string;
  description?: string;
  logoInitials: string;
  logoColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalIpos: number;
  upcomingIpos: number;
  openIpos: number;
  closedIpos: number;
  listedIpos: number;
}
