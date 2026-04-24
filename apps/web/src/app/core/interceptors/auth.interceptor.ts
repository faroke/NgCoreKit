import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Better Auth uses cookies — credentials are sent automatically.
  // This interceptor clones the request to ensure credentials are included.
  const cloned = req.clone({ withCredentials: true });
  return next(cloned);
};
