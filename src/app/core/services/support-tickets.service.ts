import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { SupportTicketResponse } from '../models/support-ticket.model';

@Injectable({ providedIn: 'root' })
export class SupportTicketsService {
  private readonly http = inject(HttpClient);

  // El backend filtra por el clientId del propio JWT cuando el rol es Client.
  list(): Observable<SupportTicketResponse[]> {
    return this.http
      .get<PagedResult<SupportTicketResponse>>(`${environment.apiUrl}/support-tickets`)
      .pipe(map((page) => page.data));
  }
}
