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

export interface QuoteResponse {
  id: string;
  requesterName: string;
  requesterEmail: string;
  institutionName: string;
  institutionType?: string;
  requesterRole?: string;
  total: number;
  status: string;
}
