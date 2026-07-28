export interface QuotesByStatusResponse {
  pending: number;
  approved: number;
  rejected: number;
}

export interface DashboardSummaryResponse {
  pendingQuotes: number;
  pendingMessages: number;
  pendingReviews: number;
  lowStockMaterials: number;
  activeProviders: number;
  totalClients: number;
  monthlyPurchasesTotal: number;
  monthlyApprovedQuotesTotal: number;
  quotesByStatus: QuotesByStatusResponse;
}
