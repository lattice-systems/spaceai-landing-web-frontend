export interface DocumentResponse {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  fileUrl: string;
  documentType: string;
  createdAt: string;
}
