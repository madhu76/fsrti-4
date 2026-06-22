import { Component } from '@angular/core';
import { NotificationService, AppNotification } from '../Services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  supportEmail: string;

  constructor(public notificationService: NotificationService) {
    this.supportEmail = notificationService.supportEmail;
  }

  iconClass(type: AppNotification['type']): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-x-octagon-fill';
    }
  }

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}
