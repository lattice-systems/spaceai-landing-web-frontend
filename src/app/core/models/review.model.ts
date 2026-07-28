export interface ReviewResponse {
  id: string;
  clientId: string;
  institutionName: string;
  contactPerson: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewsQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: string;
}
