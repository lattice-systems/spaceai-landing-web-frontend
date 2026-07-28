export interface SupportTicketResponse {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketRequest {
  clientId: string;
  subject: string;
  description: string;
  priority?: string;
}

export interface SupportTicketsQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: string;
}
