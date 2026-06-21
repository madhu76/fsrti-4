import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Sentry browser SDK (used to talk to self-hosted GlitchTip).
import * as Sentry from '@sentry/browser';

/**
 * TelemetryService
 *
 * Two independent channels, by design:
 *   1. Error capture -> GlitchTip (via Sentry SDK). May include the logged-in
 *      user's email for triage (server-side only).
 *   2. Anonymous activity beacons -> HomeServer ingest gateway -> Loki.
 *      These are fire-and-forget and contain NO email/PII (only a random,
 *      device-local anonymous id), matching the site's "log files are not
 *      linked to PII" policy.
 *
 * Everything here is non-blocking and failure-tolerant: if the HomeServer is
 * down, beacons are dropped and the app continues normally.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private initialized = false;
  private anonId = '';
  private readonly cfg = environment.observability || ({} as any);

  constructor(private router: Router, private auth: AuthService) {}

  /** Called once at app startup (via APP_INITIALIZER). Never throws. */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    try {
      this.anonId = this.getOrCreateAnonId();
    } catch (e) {
      this.anonId = 'anon';
    }

    // Initialize Sentry/GlitchTip if a DSN is configured.
    try {
      if (this.cfg.sentryDsn) {
        Sentry.init({
          dsn: this.cfg.sentryDsn,
          environment: this.cfg.env || 'production',
          release: 'jisst-frontend',
          tracesSampleRate: 0,
          maxBreadcrumbs: 20,
        });
      }
    } catch (e) {
      /* never block startup on telemetry */
    }

    // Track page views on navigation. Non-blocking.
    try {
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e: any) => {
          this.track('page_view', { url: e.urlAfterRedirects || e.url });
        });
    } catch (e) {
      /* noop */
    }

    // Keep GlitchTip's user context in sync with the logged-in user (errors only).
    try {
      this.auth.user.subscribe((user: any) => {
        this.setUser(user && user.email ? user : null);
      });
    } catch (e) {
      /* noop */
    }
  }

  /** Associate the current user with Sentry error reports (GlitchTip only). */
  setUser(user: { email?: string; name?: string } | null): void {
    try {
      if (!this.cfg.sentryDsn) return;
      if (user && user.email) {
        Sentry.setUser({ email: user.email, username: user.name });
      } else {
        Sentry.setUser(null);
      }
    } catch (e) {
      /* noop */
    }
  }

  /**
   * Send an anonymous activity beacon. Fire-and-forget; safe to call anywhere.
   * @param type  e.g. 'page_view' | 'click' | 'http_error'
   * @param props extra anonymous fields (url, status, ...). NO PII.
   */
  track(type: string, props?: { [k: string]: any }): void {
    try {
      const url = this.cfg.telemetryUrl;
      if (!url) return;

      const event = Object.assign(
        {
          type,
          anonId: this.anonId,
          ts: Date.now(),
          path: typeof location !== 'undefined' ? location.pathname : undefined,
        },
        props || {}
      );

      const body = JSON.stringify(event);
      const endpoint = url.replace(/\/+$/, '') + '/web';

      // Prefer sendBeacon (text/plain => no CORS preflight, survives page unload).
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'text/plain' });
        const ok = navigator.sendBeacon(endpoint, blob);
        if (ok) return;
      }

      // Fallback: keepalive fetch, errors swallowed.
      if (typeof fetch === 'function') {
        fetch(endpoint, {
          method: 'POST',
          body,
          keepalive: true,
          headers: { 'Content-Type': 'text/plain' },
        }).catch(() => {});
      }
    } catch (e) {
      /* never throw from telemetry */
    }
  }

  /** Report an error to GlitchTip and emit an anonymous error beacon. */
  captureError(error: any): void {
    try {
      if (this.cfg.sentryDsn) {
        Sentry.captureException(error);
      }
    } catch (e) {
      /* noop */
    }
    try {
      const message =
        (error && (error.message || error.toString && error.toString())) || 'Unknown error';
      this.track('error', { message: String(message).slice(0, 500) });
    } catch (e) {
      /* noop */
    }
  }

  private getOrCreateAnonId(): string {
    const key = 'jisst_anon_id';
    let id = '';
    try {
      id = localStorage.getItem(key) || '';
    } catch (e) {
      /* storage blocked */
    }
    if (!id) {
      id =
        typeof crypto !== 'undefined' && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : 'a-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try {
        localStorage.setItem(key, id);
      } catch (e) {
        /* ignore */
      }
    }
    return id;
  }
}
