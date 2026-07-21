import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { CreateProductRecipeRequest, ProductRecipeResponse } from '../models/product-recipe.model';

@Injectable({ providedIn: 'root' })
export class ProductRecipesService {
  private readonly http = inject(HttpClient);

  list(): Observable<ProductRecipeResponse[]> {
    return this.http
      .get<PagedResult<ProductRecipeResponse>>(`${environment.apiUrl}/product-recipes`)
      .pipe(map((page) => page.data));
  }

  create(request: CreateProductRecipeRequest): Observable<ProductRecipeResponse> {
    return this.http.post<ProductRecipeResponse>(`${environment.apiUrl}/product-recipes`, request);
  }
}
