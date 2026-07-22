import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { UserResponse } from '../models/user.model';

const TOKEN_KEY = 'spaceia_token';
const USER_KEY = 'spaceia_user';

function readStoredUser(): UserResponse | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserResponse;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // Rehidrata desde localStorage al arrancar para que la sesión sobreviva un refresh.
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _user = signal<UserResponse | null>(readStoredUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly role = computed(() => this._user()?.role ?? null);

  constructor() {
    // Mantiene localStorage sincronizado con los signals (login, logout, updateUser).
    effect(() => {
      const token = this._token();
      const user = this._user();
      if (token && user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    });
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(({ accessToken, user }) => {
        this._token.set(accessToken);
        this._user.set(user);
      }),
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
  }

  updateUser(user: UserResponse): void {
    this._user.set(user);
  }

  getToken(): string | null {
    return this._token();
  }
}
