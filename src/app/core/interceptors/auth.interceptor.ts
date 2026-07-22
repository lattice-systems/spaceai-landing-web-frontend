import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Token inválido/expirado: limpia la sesión y manda al login (evita quedar atrapado
      // con un token viejo tras un refresh).
      if (error.status === 401 && auth.getToken()) {
        auth.logout();
        router.navigateByUrl('/auth/login');
      }
      return throwError(() => error);
    }),
  );
};
