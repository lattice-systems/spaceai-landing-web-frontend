import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BulkAffectedResult } from '../models/material.model';
import { PagedResult } from '../models/paged-result.model';
import { CreateQuoteRequest, DecideQuoteRequest, QuoteResponse, QuotesQuery } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private readonly http = inject(HttpClient);

  create(request: CreateQuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(`${environment.apiUrl}/quotes`, request);
  }

  // El backend decide el alcance según el rol del JWT: Client ve solo las suyas, Admin ve todas.
  list(query: QuotesQuery): Observable<PagedResult<QuoteResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);
    if (query.dateFrom) params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params = params.set('dateTo', query.dateTo);

    return this.http.get<PagedResult<QuoteResponse>>(`${environment.apiUrl}/quotes`, { params });
  }

  /** Array plano sin paginación, para el dashboard/portal cliente (siempre trae "las mías"). */
  listAll(): Observable<QuoteResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 200 }).pipe(map((page) => page.data));
  }

  getById(id: string): Observable<QuoteResponse> {
    return this.http.get<QuoteResponse>(`${environment.apiUrl}/quotes/${id}`);
  }

  approve(id: string, request: DecideQuoteRequest): Observable<QuoteResponse> {
    return this.http.put<QuoteResponse>(`${environment.apiUrl}/quotes/${id}/approve`, request);
  }

  reject(id: string, request: DecideQuoteRequest): Observable<QuoteResponse> {
    return this.http.put<QuoteResponse>(`${environment.apiUrl}/quotes/${id}/reject`, request);
  }

  bulkDecide(ids: string[], status: 'Approved' | 'Rejected', adminNotes?: string): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/quotes/bulk-status`, {
      ids,
      status,
      adminNotes,
    });
  }
}
