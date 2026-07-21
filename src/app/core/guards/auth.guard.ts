import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/role.model';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.parseUrl('/auth/login');
  }

  const allowedRoles = route.data['roles'] as Role[] | undefined;
  if (allowedRoles && !allowedRoles.includes(auth.role()!)) {
    return router.parseUrl('/');
  }

  return true;
};
