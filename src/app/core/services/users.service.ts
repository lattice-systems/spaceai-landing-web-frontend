import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BulkAffectedResult } from '../models/material.model';
import { PagedResult } from '../models/paged-result.model';
import {
  AdminResetPasswordRequest,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserProfileRequest,
  UpdateUserRequest,
  UserResponse,
  UsersQuery,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  list(query: UsersQuery): Observable<PagedResult<UserResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.role) params = params.set('role', query.role);
    if (query.isActive !== undefined) params = params.set('isActive', query.isActive);

    return this.http.get<PagedResult<UserResponse>>(`${environment.apiUrl}/users`, { params });
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/users/${id}`);
  }

  create(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/users`, request);
  }

  update(id: string, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiUrl}/users/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/${id}/deactivate`, {});
  }

  resetPassword(id: string, request: AdminResetPasswordRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/${id}/reset-password`, request);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }

  bulkSetStatus(ids: string[], isActive: boolean): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/users/bulk-status`, { ids, isActive });
  }

  bulkDelete(ids: string[]): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/users/bulk-delete`, { ids });
  }

  updateMe(request: UpdateUserProfileRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiUrl}/users/me`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/me/password`, request);
  }
}
