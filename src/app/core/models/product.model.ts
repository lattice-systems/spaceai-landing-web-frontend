export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  moduleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
}

export interface ProductsQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
}

export interface BulkAffectedResult {
  affected: number;
  skipped: string[];
}
