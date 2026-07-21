import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { ProductResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  list(): Observable<ProductResponse[]> {
    return this.http
      .get<PagedResult<ProductResponse>>(`${environment.apiUrl}/products`)
      .pipe(map((page) => page.data));
  }
}
