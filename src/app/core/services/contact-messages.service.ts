import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactMessageResponse, CreateContactMessageRequest } from '../models/contact-message.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class ContactMessagesService {
  private readonly http = inject(HttpClient);

  create(request: CreateContactMessageRequest): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(`${environment.apiUrl}/contact-messages`, request);
  }

  list(): Observable<ContactMessageResponse[]> {
    return this.http
      .get<PagedResult<ContactMessageResponse>>(`${environment.apiUrl}/contact-messages`)
      .pipe(map((page) => page.data));
  }
}
