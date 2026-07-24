export interface ProductModuleResponse {
  id: string;
  productId: string;
  productName: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  hasRecipe: boolean;
}

export interface CreateProductModuleRequest {
  productId: string;
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductModuleRequest {
  name: string;
  description: string;
  price: number;
}

export interface ProductModulesQuery {
  pageNumber: number;
  pageSize: number;
  productId?: string;
  search?: string;
  isActive?: boolean;
}
