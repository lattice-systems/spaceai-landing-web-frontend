export interface ReviewResponse {
  id: string;
  clientId: string;
  institutionName: string;
  contactPerson: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}
