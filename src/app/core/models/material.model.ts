export interface MaterialResponse {
  id: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
  recipeCount: number;
  updatedAt: string;
}

export interface CreateMaterialRequest {
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
}

export interface UpdateMaterialRequest {
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
}

export interface MaterialsQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
  lowStock?: boolean;
}

export interface BulkAffectedResult {
  affected: number;
  skipped: string[];
}
