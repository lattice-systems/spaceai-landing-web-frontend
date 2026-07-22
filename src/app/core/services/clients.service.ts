import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientResponse, CreateClientRequest, UpdateClientRequest } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly http = inject(HttpClient);

  getById(clientId: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${environment.apiUrl}/clients/${clientId}`);
  }

  create(request: CreateClientRequest): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${environment.apiUrl}/clients`, request);
  }

  updateMe(request: UpdateClientRequest): Observable<ClientResponse> {
    return this.http.put<ClientResponse>(`${environment.apiUrl}/clients/me`, request);
  }

  update(id: string, request: UpdateClientRequest): Observable<ClientResponse> {
    return this.http.put<ClientResponse>(`${environment.apiUrl}/clients/${id}`, request);
  }
}
