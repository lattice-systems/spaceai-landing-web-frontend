export interface CreateQuoteItemRequest {
  productModuleId: string;
  quantity: number;
}

export interface CreateQuoteRequest {
  requesterName: string;
  requesterEmail: string;
  phone?: string;
  institutionName: string;
  institutionType?: string;
  requesterRole?: string;
  studentCount?: number;
  quoteItems: CreateQuoteItemRequest[];
}

export interface QuoteItemResponse {
  id: string;
  productModuleName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuoteResponse {
  id: string;
  clientId: string | null;
  clientName: string | null;
  requesterName: string;
  requesterEmail: string;
  phone: string | null;
  institutionName: string;
  institutionType: string | null;
  requesterRole: string | null;
  studentCount: number | null;
  buildingCount: number | null;
  accessPointCount: number | null;
  kioskCount: number | null;
  robotCount: number | null;
  subtotal: number;
  total: number;
  status: string;
  adminNotes: string | null;
  decidedAt: string | null;
  createdAt: string;
  items: QuoteItemResponse[];
}

export interface DecideQuoteRequest {
  adminNotes?: string;
}

export interface QuotesQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
