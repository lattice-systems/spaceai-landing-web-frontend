export interface ClientResponse {
  id: string;
  userId: string;
  institutionName: string;
  contactPerson: string;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  institutionType: string | null;
  studentCount: number | null;
  status: string;
}

export interface CreateClientRequest {
  userId: string;
  institutionName: string;
  contactPerson: string;
  phone: string;
  address: string;
}

export interface UpdateClientRequest {
  institutionName: string;
  contactPerson: string;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  institutionType: string | null;
  studentCount: number | null;
}
