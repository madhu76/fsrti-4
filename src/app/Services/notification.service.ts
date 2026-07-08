import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAX_UPLOAD_SIZE_LABEL } from '../common/file-upload.constants';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  detail?: string;
  showContact?: boolean;
  timestamp: Date;
  autoDismissMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private counter = 0;
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  // Email shown to users for unexpected/backend failures.
  readonly supportEmail = 'jisst@researchfoundation.in';

  success(message: string, autoDismissMs: number = 5000): void {
    this.push({ type: 'success', message, autoDismissMs });
  }

  info(message: string, autoDismissMs: number = 5000): void {
    this.push({ type: 'info', message, autoDismissMs });
  }

  warning(message: string): void {
    this.push({ type: 'warning', message });
  }

  error(message: string, showContact: boolean = false, detail?: string): void {
    this.push({ type: 'error', message, showContact, detail });
  }

  /**
   * Handle an error coming back from a backend HTTP call.
   * Known/expected business errors (4xx with a message) are shown as-is.
   * Unexpected failures (network errors, 5xx, or missing messages) additionally
   * prompt the user to contact support with a screenshot and timestamp.
   */
  backendError(error: any, fallback: string = 'Something went wrong. Please try again.'): void {
    const status = error?.status;
    const backendMessage =
      error?.error?.message ||
      (typeof error?.error === 'string' ? error.error : null) ||
      error?.message;

    // A Vercel serverless backend rejects bodies larger than the upload limit
    // with a 413. That response has no CORS headers, so the browser blocks it
    // and Angular reports `status: 0`. Surface a clear, actionable message for
    // both the real 413 and the masked status-0 case instead of a raw code.
    if (status === 413) {
      this.push({
        type: 'error',
        message: `The file is too large to upload. Please upload a file smaller than ${MAX_UPLOAD_SIZE_LABEL}.`,
        showContact: false,
        detail: 'Status 413 (Payload Too Large)'
      });
      return;
    }

    const isUnexpected =
      status === undefined || status === null || status === 0 || status >= 500 || !error?.error?.message;

    const message = (status >= 400 && status < 500 && error?.error?.message)
      ? backendMessage
      : (backendMessage || fallback);

    this.push({
      type: 'error',
      message: message || fallback,
      showContact: isUnexpected,
      detail: status ? `Status ${status}` : 'Network/Unknown error (this can also happen when an uploaded file exceeds ' + MAX_UPLOAD_SIZE_LABEL + ')'
    });
  }

  dismiss(id: number): void {
    this.notificationsSubject.next(
      this.notificationsSubject.value.filter(n => n.id !== id)
    );
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }

  private push(partial: Omit<AppNotification, 'id' | 'timestamp'>): void {
    const notification: AppNotification = {
      id: ++this.counter,
      timestamp: new Date(),
      ...partial
    };
    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);

    if (notification.autoDismissMs && notification.autoDismissMs > 0) {
      setTimeout(() => this.dismiss(notification.id), notification.autoDismissMs);
    }
  }
}
