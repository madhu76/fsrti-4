import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { TelemetryService } from './Services/telemetry.service';

/**
 * Global error handler. Forwards uncaught Angular errors to telemetry
 * (GlitchTip + anonymous beacon) and still logs to the console so default
 * behaviour is preserved. Uses the Injector lazily to avoid circular
 * dependency issues during bootstrap.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    try {
      const telemetry = this.injector.get(TelemetryService);
      telemetry.captureError(error);
    } catch (e) {
      /* swallow — error reporting must never throw */
    }
    // Preserve default behaviour.
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
