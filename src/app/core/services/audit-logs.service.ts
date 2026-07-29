import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLogResponse, AuditLogsQuery } from '../models/audit-log.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class AuditLogsService {
  private readonly http = inject(HttpClient);

  list(query: AuditLogsQuery): Observable<PagedResult<AuditLogResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.entityName) params = params.set('entityName', query.entityName);
    if (query.action) params = params.set('action', query.action);

    return this.http.get<PagedResult<AuditLogResponse>>(`${environment.apiUrl}/audit-logs`, { params });
  }
}
