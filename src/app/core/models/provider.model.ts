export interface ProviderResponse {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  providerType: string;
  isActive: boolean;
  purchaseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderRequest {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  providerType: string;
}

export interface UpdateProviderRequest {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  providerType: string;
}

export interface ProvidersQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
  providerType?: string;
}
