import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import {
  CreateProductModuleRequest,
  ProductModuleResponse,
  ProductModulesQuery,
  UpdateProductModuleRequest,
} from '../models/product-module.model';

@Injectable({ providedIn: 'root' })
export class ProductModulesService {
  private readonly http = inject(HttpClient);

  list(query: ProductModulesQuery): Observable<PagedResult<ProductModuleResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.productId) params = params.set('productId', query.productId);
    if (query.search) params = params.set('search', query.search);
    if (query.isActive !== undefined) params = params.set('isActive', query.isActive);

    return this.http.get<PagedResult<ProductModuleResponse>>(`${environment.apiUrl}/product-modules`, { params });
  }

  /** Catálogo completo como array plano, para consumidores que no necesitan paginación (recetas, cotizador). */
  listAll(onlyActive = true): Observable<ProductModuleResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 100, isActive: onlyActive ? true : undefined }).pipe(
      map((page) => page.data),
    );
  }

  getById(id: string): Observable<ProductModuleResponse> {
    return this.http.get<ProductModuleResponse>(`${environment.apiUrl}/product-modules/${id}`);
  }

  create(request: CreateProductModuleRequest): Observable<ProductModuleResponse> {
    return this.http.post<ProductModuleResponse>(`${environment.apiUrl}/product-modules`, request);
  }

  update(id: string, request: UpdateProductModuleRequest): Observable<ProductModuleResponse> {
    return this.http.put<ProductModuleResponse>(`${environment.apiUrl}/product-modules/${id}`, request);
  }

  activate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/product-modules/${id}/activate`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/product-modules/${id}/deactivate`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/product-modules/${id}`);
  }
}
