export interface PurchaseResponse {
  id: string;
  providerId: string;
  total: number;
  status: string;
}

export interface CreatePurchaseItemRequest {
  materialName: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseRequest {
  providerId: string;
  purchaseItems: CreatePurchaseItemRequest[];
}
