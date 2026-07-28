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
  createdAt: string;
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
