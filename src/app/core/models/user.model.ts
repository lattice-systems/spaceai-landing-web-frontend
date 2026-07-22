import { Role } from './role.model';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  clientId: string | null;
  isActive: boolean;
  createdAt: string;
  institutionName: string | null;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  roleId: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  roleId: string;
}

export interface AdminResetPasswordRequest {
  newPassword: string;
}

export interface UsersQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  role?: Role;
  isActive?: boolean;
}
