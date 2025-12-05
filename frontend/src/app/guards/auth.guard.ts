  // import { inject } from '@angular/core';
  // import { Router, CanActivateFn } from '@angular/router';
  // import { AuthService } from '../services/auth.service';

  // export const authGuard: CanActivateFn = () => {
  //   const authService = inject(AuthService);
  //   const router = inject(Router);

  //   // if (authService.isAuthenticated()) return true;
  // const isLoggedIn = authService.isAuthenticated();

  //   if (isLoggedIn) {
  //     return true;
  //   }
  // //   router.navigate(['/login']);
  // //   return false;
  // // };
  //   return router.createUrlTree(['/login']);
  // };

  // src/app/guards/auth.guard.ts
  // import { inject } from '@angular/core';
  // import { Router, CanActivateFn, UrlTree } from '@angular/router';
  // import { AuthService } from '../services/auth.service';

  // export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  //   const authService = inject(AuthService);
  //   const router = inject(Router);

  //   const isLoggedIn = authService.isLoggedIn(); // synchronous boolean

  //   if (isLoggedIn) {
  //     return true;
  //   }

  //   // return UrlTree so Angular cancels navigation immediately (no flicker)
  //   return router.createUrlTree(['/login'], { queryParams: { returnUrl: state?.url } });
  // };

  import { inject } from '@angular/core';
  import { Router, CanActivateFn } from '@angular/router';
  import { AuthService } from '../services/auth.service';

  export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      return true;
    }

    // Redirect to login WITHOUT adding to history
  router.navigate(['/login'], { replaceUrl: true });
  return false;
};