import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { ChangePasswordRequest, UpdateUserProfileRequest, UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  list(): Observable<UserResponse[]> {
    return this.http
      .get<PagedResult<UserResponse>>(`${environment.apiUrl}/users`)
      .pipe(map((page) => page.data));
  }

  updateMe(request: UpdateUserProfileRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiUrl}/users/me`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/me/password`, request);
  }
}
