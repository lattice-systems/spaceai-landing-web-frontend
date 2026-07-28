import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import {
  CreateProductRecipeRequest,
  ProductRecipeHistoryItemResponse,
  ProductRecipeResponse,
  ProductRecipesQuery,
  UpdateProductRecipeRequest,
} from '../models/product-recipe.model';

@Injectable({ providedIn: 'root' })
export class ProductRecipesService {
  private readonly http = inject(HttpClient);

  list(query: ProductRecipesQuery): Observable<PagedResult<ProductRecipeResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.productModuleId) params = params.set('productModuleId', query.productModuleId);
    if (query.materialId) params = params.set('materialId', query.materialId);

    return this.http.get<PagedResult<ProductRecipeResponse>>(`${environment.apiUrl}/product-recipes`, { params });
  }

  getById(id: string): Observable<ProductRecipeResponse> {
    return this.http.get<ProductRecipeResponse>(`${environment.apiUrl}/product-recipes/${id}`);
  }

  create(request: CreateProductRecipeRequest): Observable<ProductRecipeResponse> {
    return this.http.post<ProductRecipeResponse>(`${environment.apiUrl}/product-recipes`, request);
  }

  update(id: string, request: UpdateProductRecipeRequest): Observable<ProductRecipeResponse> {
    return this.http.put<ProductRecipeResponse>(`${environment.apiUrl}/product-recipes/${id}`, request);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/product-recipes/${id}`);
  }

  getHistory(productModuleId: string, materialId: string): Observable<ProductRecipeHistoryItemResponse[]> {
    const params = new HttpParams().set('productModuleId', productModuleId).set('materialId', materialId);
    return this.http.get<ProductRecipeHistoryItemResponse[]>(`${environment.apiUrl}/product-recipes/history`, {
      params,
    });
  }
}
