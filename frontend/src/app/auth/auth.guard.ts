import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();

  const requestedPath = route.routeConfig?.path;

  if (isLoggedIn) {
    // Prevent logged-in users from accessing /login
    if (requestedPath === 'login') {
      return router.createUrlTree(['/']); // redirect to dashboard (now at '')
    }
    return true;
  } else {
    // Allow unauthenticated users only to access /login
    if (requestedPath === 'login') {
      return true;
    }
    return router.createUrlTree(['/login']); // redirect all others to login
  }
};
