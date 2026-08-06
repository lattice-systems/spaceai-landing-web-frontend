export interface MaterialResponse {
  id: string;
  name: string;
  description: string;
  unitOfMeasure: string;
  /** Último costo de compra / referencia manual. No es el costo de costeo. */
  unitCost: number;
  /** Costo Promedio Ponderado vigente — el que usa el costeo de recetas y ventas. */
  averageCost: number;
  /** currentStock * averageCost. */
  stockValue: number;
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
  recipeCount: number;
  updatedAt: string;
}

/** Una línea del kardex: movimiento + saldo que dejó. */
export interface InventoryMovementResponse {
  id: string;
  materialId: string;
  materialName: string;
  movementType: 'In' | 'Out';
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason: string;
  balanceQuantity: number;
  balanceAverageCost: number;
  balanceTotalCost: number;
  createdAt: string;
}

export interface MaterialKardexResponse {
  materialId: string;
  materialName: string;
  unitOfMeasure: string;
  currentStock: number;
  averageCost: number;
  stockValue: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: InventoryMovementResponse[];
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
