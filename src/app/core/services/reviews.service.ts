import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { CreateReviewRequest, ReviewResponse } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);

  // Backend decide el alcance: público/anónimo ve solo aprobadas, Client ve aprobadas + las
  // suyas propias (aunque pendientes), Admin ve todas para poder moderarlas.
  list(): Observable<ReviewResponse[]> {
    return this.http
      .get<PagedResult<ReviewResponse>>(`${environment.apiUrl}/reviews`)
      .pipe(map((page) => page.data));
  }

  create(request: CreateReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${environment.apiUrl}/reviews`, request);
  }

  approve(id: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/reviews/${id}/approve`, {});
  }

  reject(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/reviews/${id}`);
  }
}
