import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BusinessSettingResponse, UpdateBusinessSettingRequest } from '../models/business-setting.model';

@Injectable({ providedIn: 'root' })
export class BusinessSettingsService {
  private readonly http = inject(HttpClient);

  get(): Observable<BusinessSettingResponse> {
    return this.http.get<BusinessSettingResponse>(`${environment.apiUrl}/business-settings`);
  }

  update(request: UpdateBusinessSettingRequest): Observable<BusinessSettingResponse> {
    return this.http.put<BusinessSettingResponse>(`${environment.apiUrl}/business-settings`, request);
  }
}
