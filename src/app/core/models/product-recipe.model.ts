export interface ProductRecipeResponse {
  id: string;
  productModuleId: string;
  productModuleName: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface CreateProductRecipeRequest {
  productModuleId: string;
  materialId: string;
  quantity: number;
}

export interface UpdateProductRecipeRequest {
  quantity: number;
}

export interface ProductRecipesQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  productModuleId?: string;
  materialId?: string;
}

export interface ProductRecipeHistoryItemResponse {
  id: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  createdAt: string;
  isCurrent: boolean;
  supersededByRecipeId: string | null;
}
