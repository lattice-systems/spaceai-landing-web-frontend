import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ContactMessageResponse,
  ContactMessagesQuery,
  CreateContactMessageRequest,
} from '../models/contact-message.model';
import { BulkAffectedResult } from '../models/material.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class ContactMessagesService {
  private readonly http = inject(HttpClient);

  create(request: CreateContactMessageRequest): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(`${environment.apiUrl}/contact-messages`, request);
  }

  list(query: ContactMessagesQuery): Observable<PagedResult<ContactMessageResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);

    return this.http.get<PagedResult<ContactMessageResponse>>(`${environment.apiUrl}/contact-messages`, { params });
  }

  getById(id: string): Observable<ContactMessageResponse> {
    return this.http.get<ContactMessageResponse>(`${environment.apiUrl}/contact-messages/${id}`);
  }

  markAnswered(id: string): Observable<ContactMessageResponse> {
    return this.http.put<ContactMessageResponse>(`${environment.apiUrl}/contact-messages/${id}/answered`, {});
  }

  archive(id: string): Observable<ContactMessageResponse> {
    return this.http.put<ContactMessageResponse>(`${environment.apiUrl}/contact-messages/${id}/archived`, {});
  }

  bulkSetStatus(ids: string[], status: 'Answered' | 'Archived'): Observable<BulkAffectedResult> {
    return this.http.post<BulkAffectedResult>(`${environment.apiUrl}/contact-messages/bulk-status`, { ids, status });
  }
}
