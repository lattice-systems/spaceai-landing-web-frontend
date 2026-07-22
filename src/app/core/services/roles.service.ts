import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleResponse } from '../models/role-catalog.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);

  list(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${environment.apiUrl}/roles`);
  }
}
