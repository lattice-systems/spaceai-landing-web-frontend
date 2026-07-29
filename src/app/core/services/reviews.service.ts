import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BulkAffectedResult } from '../models/material.model';
import { PagedResult } from '../models/paged-result.model';
import {
  CreateReviewRequest,
  DecideReviewRequest,
  EligibleModuleResponse,
  ReviewResponse,
  ReviewsQuery,
} from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);

  // Backend decide el alcance: público/anónimo ve solo aprobadas, Client ve aprobadas + las
  // suyas propias (aunque pendientes/rechazadas), Admin ve todas para poder moderarlas.
  list(query: ReviewsQuery): Observable<PagedResult<ReviewResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);

    return this.http.get<PagedResult<ReviewResponse>>(`${environment.apiUrl}/reviews`, { params });
  }

  /** Array plano sin paginación, para consumidores públicos/portal (testimonios, mis reseñas). */
  listAll(): Observable<ReviewResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 200 }).pipe(map((page) => page.data));
  }

  getById(id: string): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${environment.apiUrl}/reviews/${id}`);
  }

  create(request: CreateReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${environment.apiUrl}/reviews`, request);
  }

  approve(id: string, request: DecideReviewRequest = {}): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${environment.apiUrl}/reviews/${id}/approve`, request);
  }

  reject(id: string, request: DecideReviewRequest = {}): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${environment.apiUrl}/reviews/${id}/reject`, request);
  }

  bulkDecide(ids: string[], status: 'Approved' | 'Rejected'): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/reviews/bulk-status`, { ids, status });
  }

  getEligibleModules(): Observable<EligibleModuleResponse[]> {
    return this.http.get<EligibleModuleResponse[]>(`${environment.apiUrl}/reviews/eligible-modules`);
  }
}
