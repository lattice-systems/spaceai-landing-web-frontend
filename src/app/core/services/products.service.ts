import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import {
  BulkAffectedResult,
  CreateProductRequest,
  ProductResponse,
  ProductsQuery,
  UpdateProductRequest,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  list(query: ProductsQuery): Observable<PagedResult<ProductResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.isActive !== undefined) params = params.set('isActive', query.isActive);

    return this.http.get<PagedResult<ProductResponse>>(`${environment.apiUrl}/products`, { params });
  }

  /** Catálogo completo como array plano, para consumidores que no necesitan paginación (p. ej. selects). */
  listAll(onlyActive = true): Observable<ProductResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 100, isActive: onlyActive ? true : undefined }).pipe(
      map((page) => page.data),
    );
  }

  getById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${environment.apiUrl}/products/${id}`);
  }

  create(request: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${environment.apiUrl}/products`, request);
  }

  update(id: string, request: UpdateProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${environment.apiUrl}/products/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/products/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/products/${id}/deactivate`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }

  bulkSetStatus(ids: string[], isActive: boolean): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/products/bulk-status`, { ids, isActive });
  }

  bulkDelete(ids: string[]): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/products/bulk-delete`, { ids });
  }
}
