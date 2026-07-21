import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { CreateQuoteRequest, QuoteResponse } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private readonly http = inject(HttpClient);

  create(request: CreateQuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(`${environment.apiUrl}/quotes`, request);
  }

  // El backend decide el alcance según el rol del JWT: Client ve solo las suyas, Admin ve todas.
  list(): Observable<QuoteResponse[]> {
    return this.http
      .get<PagedResult<QuoteResponse>>(`${environment.apiUrl}/quotes`)
      .pipe(map((page) => page.data));
  }
}
