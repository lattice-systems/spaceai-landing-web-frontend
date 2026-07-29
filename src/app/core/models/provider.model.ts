export interface ProviderResponse {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  providerType: string;
  taxId: string | null;
  bankName: string | null;
  bankAccount: string | null;
  certifications: string | null;
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
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  certifications?: string;
}

export interface UpdateProviderRequest {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  providerType: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  certifications?: string;
}

export interface ProvidersQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
  providerType?: string;
}
