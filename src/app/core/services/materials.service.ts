import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMaterialRequest, MaterialResponse } from '../models/material.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class MaterialsService {
  private readonly http = inject(HttpClient);

  list(): Observable<MaterialResponse[]> {
    return this.http
      .get<PagedResult<MaterialResponse>>(`${environment.apiUrl}/materials`)
      .pipe(map((page) => page.data));
  }

  create(request: CreateMaterialRequest): Observable<MaterialResponse> {
    return this.http.post<MaterialResponse>(`${environment.apiUrl}/materials`, request);
  }
}
