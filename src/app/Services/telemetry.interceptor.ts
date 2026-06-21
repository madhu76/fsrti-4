import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TelemetryService } from './telemetry.service';
import { environment } from '../../environments/environment';

/**
 * Records failed and slow HTTP calls as anonymous telemetry. Completely
 * passive — it never modifies requests/responses and never blocks them.
 * Requests to the telemetry endpoint itself are ignored to avoid loops.
 */
@Injectable()
export class TelemetryInterceptor implements HttpInterceptor {
  private readonly telemetryUrl = (environment.observability || ({} as any)).telemetryUrl || '';

  constructor(private telemetry: TelemetryService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.telemetryUrl && req.url.indexOf(this.telemetryUrl) === 0) {
      return next.handle(req);
    }

    const start = Date.now();
    return next.handle(req).pipe(
      tap({
        error: (err) => {
          try {
            const status = err instanceof HttpErrorResponse ? err.status : 0;
            this.telemetry.track('http_error', {
              method: req.method,
              // Strip query string to avoid leaking values.
              url: req.url.split('?')[0],
              status,
              durationMs: Date.now() - start,
            });
          } catch (e) {
            /* noop */
          }
        },
      })
    );
  }
}
