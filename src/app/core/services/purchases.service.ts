import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { CreatePurchaseRequest, PurchaseResponse, PurchasesQuery } from '../models/purchase.model';

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private readonly http = inject(HttpClient);

  list(query: PurchasesQuery): Observable<PagedResult<PurchaseResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.providerId) params = params.set('providerId', query.providerId);
    if (query.status) params = params.set('status', query.status);
    if (query.dateFrom) params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params = params.set('dateTo', query.dateTo);

    return this.http.get<PagedResult<PurchaseResponse>>(`${environment.apiUrl}/purchases`, { params });
  }

  getById(id: string): Observable<PurchaseResponse> {
    return this.http.get<PurchaseResponse>(`${environment.apiUrl}/purchases/${id}`);
  }

  create(request: CreatePurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${environment.apiUrl}/purchases`, request);
  }

  cancel(id: string): Observable<PurchaseResponse> {
    return this.http.put<PurchaseResponse>(`${environment.apiUrl}/purchases/${id}/cancel`, {});
  }
}
