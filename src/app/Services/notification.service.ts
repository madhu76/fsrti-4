import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

    const isUnexpected =
      status === undefined || status === null || status === 0 || status >= 500 || !error?.error?.message;

    const message = (status >= 400 && status < 500 && error?.error?.message)
      ? backendMessage
      : (backendMessage || fallback);

    this.push({
      type: 'error',
      message: message || fallback,
      showContact: isUnexpected,
      detail: status ? `Status ${status}` : 'Network/Unknown error'
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
