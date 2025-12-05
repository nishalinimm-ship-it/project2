// guards/login.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already logged in, redirect to dashboard
  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard'], { replaceUrl: true });
    return false;
  }

  return true;
};