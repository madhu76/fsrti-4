import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';
import { AuthService } from '../Services/auth.service';
import { TelemetryService } from '../Services/telemetry.service';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <button type="button" class="btn btn-link" (click)="view()" [disabled]="loading">
      <i class="fa fa-file-pdf"></i> {{ loading ? 'Loading...' : (auth.isAuthenticated ? 'View' : 'Log in to view') }}
    </button>
    <div *ngIf="viewerUrl" class="pdf-overlay" role="dialog" aria-modal="true" aria-label="PDF viewer">
      <button type="button" class="btn btn-light" (click)="close()">Close viewer</button>
      <iframe [src]="viewerUrl" title="Publication PDF" (load)="onViewerLoad()"></iframe>
    </div>
  `,
  styles: [`
    .pdf-overlay { position: fixed; inset: 0; z-index: 1100; background: #fff;
      display: flex; flex-direction: column; padding: 1rem; }
    .pdf-overlay button { align-self: flex-end; margin-bottom: .5rem; }
    iframe { width: 100%; flex: 1; border: 0; }
  `]
})
export class PdfViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() itemId: string;
  @Input() url: string;
  @Input() issue: string;
  @Input() documentType: 'article' | 'contents' | 'editorial' = 'article';
  viewerUrl: SafeResourceUrl;
  loading = false;
  private objectUrl: string;
  private request: Subscription;
  private authSubscription: Subscription;
  private viewLogged = false;

  constructor(
    private http: HttpClient,
    private fileUrls: FileUrlService,
    private sanitizer: DomSanitizer,
    private notifications: NotificationService,
    public auth: AuthService,
    private telemetry: TelemetryService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.auth.user.subscribe(user => {
      if (!user || !user.email) {
        this.close();
      }
    });
  }

  view(): void {
    this.close();
    if (!this.auth.isAuthenticated) {
      this.notifications.warning('Please log in using the navigation bar to view this publication.');
      return;
    }
    this.loading = true;
    const source = this.itemId ? this.fileUrls.getPdfUrlByItemId(this.itemId) : of(this.url);
    this.request = source.pipe(
      switchMap(url => this.http.get(url, { responseType: 'blob' }))
    ).subscribe(data => {
      if (!this.auth.isAuthenticated) {
        this.close();
        return;
      }
      this.objectUrl = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      // Only a locally-created PDF blob is trusted, never a remote resource URL.
      this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl + '#toolbar=0');
      this.loading = false;
    }, error => {
      this.loading = false;
      this.notifications.backendError(error, 'Unable to view the file.');
    });
  }

  onViewerLoad(): void {
    if (!this.viewerUrl || !this.auth.isAuthenticated || this.viewLogged) {
      return;
    }
    this.viewLogged = true;
    this.telemetry.track('publication_view', {
      itemId: this.itemId,
      issue: this.issue,
      documentType: this.documentType,
      authenticated: true
    });
  }

  close(): void {
    if (this.request) {
      this.request.unsubscribe();
    }
    this.viewerUrl = null;
    this.viewLogged = false;
    this.loading = false;
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  ngOnChanges(): void { this.close(); }
  ngOnDestroy(): void {
    this.close();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
