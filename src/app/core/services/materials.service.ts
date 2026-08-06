import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import {
  BulkAffectedResult,
  CreateMaterialRequest,
  MaterialKardexResponse,
  MaterialResponse,
  MaterialsQuery,
  UpdateMaterialRequest,
} from '../models/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialsService {
  private readonly http = inject(HttpClient);

  list(query: MaterialsQuery): Observable<PagedResult<MaterialResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.isActive !== undefined) params = params.set('isActive', query.isActive);
    if (query.lowStock !== undefined) params = params.set('lowStock', query.lowStock);

    return this.http.get<PagedResult<MaterialResponse>>(`${environment.apiUrl}/materials`, { params });
  }

  /** Catálogo completo como array plano, para consumidores que no necesitan paginación (recetas). */
  listAll(): Observable<MaterialResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 200 }).pipe(map((page) => page.data));
  }

  getById(id: string): Observable<MaterialResponse> {
    return this.http.get<MaterialResponse>(`${environment.apiUrl}/materials/${id}`);
  }

  create(request: CreateMaterialRequest): Observable<MaterialResponse> {
    return this.http.post<MaterialResponse>(`${environment.apiUrl}/materials`, request);
  }

  update(id: string, request: UpdateMaterialRequest): Observable<MaterialResponse> {
    return this.http.put<MaterialResponse>(`${environment.apiUrl}/materials/${id}`, request);
  }

  adjustStock(id: string, delta: number, reason: string): Observable<MaterialResponse> {
    return this.http.put<MaterialResponse>(`${environment.apiUrl}/materials/${id}/adjust-stock`, { delta, reason });
  }

  /** Kardex: movimientos en orden cronológico con el saldo que dejó cada uno. */
  kardex(id: string, pageNumber = 1, pageSize = 50): Observable<MaterialKardexResponse> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<MaterialKardexResponse>(`${environment.apiUrl}/materials/${id}/kardex`, { params });
  }

  activate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/materials/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/materials/${id}/deactivate`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/materials/${id}`);
  }

  bulkSetStatus(ids: string[], isActive: boolean): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/materials/bulk-status`, { ids, isActive });
  }

  bulkDelete(ids: string[]): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/materials/bulk-delete`, { ids });
  }
}
