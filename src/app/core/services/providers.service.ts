import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { CreateProviderRequest, ProviderResponse } from '../models/provider.model';

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  private readonly http = inject(HttpClient);

  list(): Observable<ProviderResponse[]> {
    return this.http
      .get<PagedResult<ProviderResponse>>(`${environment.apiUrl}/providers`)
      .pipe(map((page) => page.data));
  }

  create(request: CreateProviderRequest): Observable<ProviderResponse> {
    return this.http.post<ProviderResponse>(`${environment.apiUrl}/providers`, request);
  }
}
