import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { ProductModuleResponse } from '../models/product-module.model';

@Injectable({ providedIn: 'root' })
export class ProductModulesService {
  private readonly http = inject(HttpClient);

  list(): Observable<ProductModuleResponse[]> {
    return this.http
      .get<PagedResult<ProductModuleResponse>>(`${environment.apiUrl}/product-modules`)
      .pipe(map((page) => page.data));
  }
}
