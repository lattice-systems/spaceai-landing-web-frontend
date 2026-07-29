import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { SaleResponse } from '../models/sale.model';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);

  list(pageNumber: number, pageSize: number): Observable<PagedResult<SaleResponse>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PagedResult<SaleResponse>>(`${environment.apiUrl}/sales`, { params });
  }

  updateStatus(id: string, status: 'Pending' | 'Delivered'): Observable<SaleResponse> {
    return this.http.put<SaleResponse>(`${environment.apiUrl}/sales/${id}/status`, { status });
  }
}
