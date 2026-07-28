export interface ReviewResponse {
  id: string;
  clientId: string;
  institutionName: string;
  contactPerson: string;
  productModuleId: string;
  productModuleName: string;
  rating: number;
  comment: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
}

export interface DecideReviewRequest {
  adminNotes?: string;
}

export interface CreateReviewRequest {
  productModuleId: string;
  rating: number;
  comment: string;
}

export interface ReviewsQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: string;
}
