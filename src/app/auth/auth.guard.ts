import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { take, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  
  return authService.isAuth.pipe(take(1), tap(isAuthenticated => {
    if (!isAuthenticated) {
      router.navigateByUrl('/auth');
    }
  }));
};
