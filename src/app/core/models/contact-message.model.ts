export interface CreateContactMessageRequest {
  name: string;
  email: string;
  jobTitle?: string;
  institutionName?: string;
  message: string;
}

export interface ContactMessageResponse {
  id: string;
  name: string;
  email: string;
  jobTitle?: string;
  institutionName?: string;
  message: string;
  status: string;
}
