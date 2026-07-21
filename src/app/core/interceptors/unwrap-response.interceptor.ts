import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function isApiEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return (
    typeof body === 'object' && body !== null && 'success' in body && 'data' in body
  );
}

export const unwrapResponseInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    map((event: HttpEvent<unknown>) =>
      event instanceof HttpResponse && isApiEnvelope(event.body)
        ? event.clone({ body: event.body.data })
        : event,
    ),
  );
