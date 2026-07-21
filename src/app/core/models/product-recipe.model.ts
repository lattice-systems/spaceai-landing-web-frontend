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
