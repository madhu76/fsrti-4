import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <button type="button" class="btn btn-link" (click)="view()" [disabled]="loading">
      <i class="fa fa-file-pdf"></i> {{ loading ? 'Loading...' : 'View' }}
    </button>
    <div *ngIf="viewerUrl" class="pdf-overlay" role="dialog" aria-modal="true" aria-label="PDF viewer">
      <button type="button" class="btn btn-light" (click)="close()">Close viewer</button>
      <iframe [src]="viewerUrl" title="Publication PDF"></iframe>
    </div>
  `,
  styles: [`
    .pdf-overlay { position: fixed; inset: 0; z-index: 1100; background: #fff;
      display: flex; flex-direction: column; padding: 1rem; }
    .pdf-overlay button { align-self: flex-end; margin-bottom: .5rem; }
    iframe { width: 100%; flex: 1; border: 0; }
  `]
})
export class PdfViewerComponent implements OnChanges, OnDestroy {
  @Input() itemId: string;
  @Input() url: string;
  viewerUrl: SafeResourceUrl;
  loading = false;
  private objectUrl: string;
  private request: Subscription;

  constructor(
    private http: HttpClient,
    private fileUrls: FileUrlService,
    private sanitizer: DomSanitizer,
    private notifications: NotificationService
  ) {}

  view(): void {
    this.close();
    this.loading = true;
    const source = this.itemId ? this.fileUrls.getPdfUrlByItemId(this.itemId) : of(this.url);
    this.request = source.pipe(
      switchMap(url => this.http.get(url, { responseType: 'blob' }))
    ).subscribe(data => {
      this.objectUrl = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      // Only a locally-created PDF blob is trusted, never a remote resource URL.
      this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl + '#toolbar=0');
      this.loading = false;
    }, error => {
      this.loading = false;
      this.notifications.backendError(error, 'Unable to view the file.');
    });
  }

  close(): void {
    if (this.request) {
      this.request.unsubscribe();
    }
    this.viewerUrl = null;
    this.loading = false;
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  ngOnChanges(): void { this.close(); }
  ngOnDestroy(): void { this.close(); }
}
