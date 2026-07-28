export interface QuotesByStatusResponse {
  pending: number;
  approved: number;
  rejected: number;
}

export interface AdminActivityItemResponse {
  title: string;
  category: string;
  date: string;
}

export interface DashboardSummaryResponse {
  pendingQuotes: number;
  pendingMessages: number;
  pendingReviews: number;
  lowStockMaterials: number;
  openSupportTickets: number;
  activeProviders: number;
  totalClients: number;
  monthlyPurchasesTotal: number;
  monthlyApprovedQuotesTotal: number;
  quotesByStatus: QuotesByStatusResponse;
  recentActivity: AdminActivityItemResponse[];
}

export interface ClientActivityItemResponse {
  title: string;
  category: string;
  date: string;
}

export interface ClientDashboardSummaryResponse {
  openTickets: number;
  totalDocuments: number;
  quotesByStatus: QuotesByStatusResponse;
  recentActivity: ClientActivityItemResponse[];
}
