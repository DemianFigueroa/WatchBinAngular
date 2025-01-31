import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService); // Use inject to get CookieService

  // Retrieve the JWT token from cookies
  const token = cookieService.get('jwtToken');

  if (token) {
    // Clone the request and add the Authorization header with the token
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Proceed with the cloned request
    return next(clonedRequest);
  }

  // If no token, proceed with the original request
  return next(req);
};