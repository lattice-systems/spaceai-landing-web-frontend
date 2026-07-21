import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { CreatePurchaseRequest, PurchaseResponse } from '../models/purchase.model';

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private readonly http = inject(HttpClient);

  list(): Observable<PurchaseResponse[]> {
    return this.http
      .get<PagedResult<PurchaseResponse>>(`${environment.apiUrl}/purchases`)
      .pipe(map((page) => page.data));
  }

  create(request: CreatePurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${environment.apiUrl}/purchases`, request);
  }
}
