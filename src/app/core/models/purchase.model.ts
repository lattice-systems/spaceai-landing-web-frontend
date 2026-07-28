export interface PurchaseItemResponse {
  id: string;
  materialId: string | null;
  materialName: string;
  description: string | null;
  quantity: number;
  unitCost: number;
  subtotal: number;
  receivedQuantity: number;
}

export interface ReceivePurchaseItemRequest {
  purchaseItemId: string;
  receivedQuantity: number;
}

export interface ReceivePurchaseRequest {
  items: ReceivePurchaseItemRequest[];
}

export interface PurchaseResponse {
  id: string;
  providerId: string;
  providerName: string;
  purchaseDate: string;
  total: number;
  status: string;
  notes: string | null;
  items: PurchaseItemResponse[];
}

export interface CreatePurchaseItemRequest {
  materialId?: string | null;
  materialName: string;
  description?: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseRequest {
  providerId: string;
  notes?: string;
  purchaseItems: CreatePurchaseItemRequest[];
}

export interface PurchasesQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  providerId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
