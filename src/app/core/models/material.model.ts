export interface MaterialResponse {
  id: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
}

export interface CreateMaterialRequest {
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
}
