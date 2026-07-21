import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { DocumentResponse } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly http = inject(HttpClient);

  // El backend decide qué documentos ver según el rol del token (Admin ve todo,
  // Client/anónimo solo los marcados IsVisibleToClients) — no se manda clientId.
  list(): Observable<DocumentResponse[]> {
    return this.http
      .get<PagedResult<DocumentResponse>>(`${environment.apiUrl}/documents`)
      .pipe(map((page) => page.data));
  }
}
