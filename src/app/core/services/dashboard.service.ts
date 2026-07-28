import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientDashboardSummaryResponse, DashboardSummaryResponse } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummaryResponse> {
    return this.http.get<DashboardSummaryResponse>(`${environment.apiUrl}/dashboard/summary`);
  }

  getClientSummary(): Observable<ClientDashboardSummaryResponse> {
    return this.http.get<ClientDashboardSummaryResponse>(`${environment.apiUrl}/client-dashboard/summary`);
  }
}
