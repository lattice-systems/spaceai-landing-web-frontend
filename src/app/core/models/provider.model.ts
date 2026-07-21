export interface ProviderResponse {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface CreateProviderRequest {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}
