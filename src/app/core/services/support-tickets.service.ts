import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import {
  CreateSupportTicketMessageRequest,
  CreateSupportTicketRequest,
  SupportTicketMessageResponse,
  SupportTicketResponse,
  SupportTicketsQuery,
} from '../models/support-ticket.model';

@Injectable({ providedIn: 'root' })
export class SupportTicketsService {
  private readonly http = inject(HttpClient);

  // El backend filtra por el clientId del propio JWT cuando el rol es Client.
  list(query: SupportTicketsQuery): Observable<PagedResult<SupportTicketResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);

    return this.http.get<PagedResult<SupportTicketResponse>>(`${environment.apiUrl}/support-tickets`, { params });
  }

  listAll(): Observable<SupportTicketResponse[]> {
    return this.list({ pageNumber: 1, pageSize: 200 }).pipe(map((page) => page.data));
  }

  getById(id: string): Observable<SupportTicketResponse> {
    return this.http.get<SupportTicketResponse>(`${environment.apiUrl}/support-tickets/${id}`);
  }

  create(request: CreateSupportTicketRequest): Observable<SupportTicketResponse> {
    return this.http.post<SupportTicketResponse>(`${environment.apiUrl}/support-tickets`, request);
  }

  getMessages(id: string): Observable<SupportTicketMessageResponse[]> {
    return this.http.get<SupportTicketMessageResponse[]>(`${environment.apiUrl}/support-tickets/${id}/messages`);
  }

  addMessage(id: string, request: CreateSupportTicketMessageRequest): Observable<SupportTicketMessageResponse> {
    return this.http.post<SupportTicketMessageResponse>(
      `${environment.apiUrl}/support-tickets/${id}/messages`,
      request,
    );
  }

  updateStatus(id: string, status: string): Observable<SupportTicketResponse> {
    return this.http.put<SupportTicketResponse>(`${environment.apiUrl}/support-tickets/${id}/status`, { status });
  }
}
