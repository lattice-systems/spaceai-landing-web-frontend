import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BulkAffectedResult } from '../models/material.model';
import { PagedResult } from '../models/paged-result.model';
import {
  CreateProviderRequest,
  ProviderResponse,
  ProvidersQuery,
  UpdateProviderRequest,
} from '../models/provider.model';

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  private readonly http = inject(HttpClient);

  list(query: ProvidersQuery): Observable<PagedResult<ProviderResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.isActive !== undefined) params = params.set('isActive', query.isActive);
    if (query.providerType) params = params.set('providerType', query.providerType);

    return this.http.get<PagedResult<ProviderResponse>>(`${environment.apiUrl}/providers`, { params });
  }

  /** Catálogo completo como array plano, para consumidores que no necesitan paginación (compras). */
  listAll(): Observable<ProviderResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 200 }).pipe(map((page) => page.data));
  }

  getById(id: string): Observable<ProviderResponse> {
    return this.http.get<ProviderResponse>(`${environment.apiUrl}/providers/${id}`);
  }

  create(request: CreateProviderRequest): Observable<ProviderResponse> {
    return this.http.post<ProviderResponse>(`${environment.apiUrl}/providers`, request);
  }

  update(id: string, request: UpdateProviderRequest): Observable<ProviderResponse> {
    return this.http.put<ProviderResponse>(`${environment.apiUrl}/providers/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/providers/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/providers/${id}/deactivate`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/providers/${id}`);
  }

  bulkSetStatus(ids: string[], isActive: boolean): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/providers/bulk-status`, { ids, isActive });
  }

  bulkDelete(ids: string[]): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/providers/bulk-delete`, { ids });
  }
}
