import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';
import { PdfViewerComponent } from './pdf-viewer.component';
import { AuthService } from '../Services/auth.service';
import { TelemetryService } from '../Services/telemetry.service';

describe('PdfViewerComponent', () => {
  let fixture: ComponentFixture<PdfViewerComponent>;
  let component: PdfViewerComponent;
  let http: HttpTestingController;
  let notifications: jasmine.SpyObj<NotificationService>;
  let fileUrls: jasmine.SpyObj<FileUrlService>;
  let telemetry: jasmine.SpyObj<TelemetryService>;
  let user: BehaviorSubject<{ email?: string }>;
  let auth: { isAuthenticated: boolean; user: BehaviorSubject<{ email?: string }> };

  beforeEach(() => {
    notifications = jasmine.createSpyObj('Notifications', ['backendError', 'warning']);
    telemetry = jasmine.createSpyObj('Telemetry', ['track']);
    user = new BehaviorSubject({ email: 'reader@example.com' });
    auth = { isAuthenticated: true, user };
    fileUrls = jasmine.createSpyObj('FileUrlService', ['getPdfUrlByItemId']);
    fileUrls.getPdfUrlByItemId.and.returnValue(of('https://example.com/article.pdf'));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PdfViewerComponent],
      providers: [
        { provide: FileUrlService, useValue: fileUrls },
        { provide: NotificationService, useValue: notifications },
        { provide: AuthService, useValue: auth },
        { provide: TelemetryService, useValue: telemetry }
      ]
    });
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:publication');
    spyOn(URL, 'revokeObjectURL');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    http.verify();
  });

  it('resolves an article and displays its PDF without download controls or navigation links', () => {
    component.itemId = 'article-1';
    component.issue = '1.1';
    component.view();
    http.expectOne('https://example.com/article.pdf').flush(new Blob(['%PDF-1.4']));
    expect(telemetry.track).not.toHaveBeenCalled();
    fixture.detectChanges();
    expect(fileUrls.getPdfUrlByItemId).toHaveBeenCalledWith('article-1');
    expect(fixture.nativeElement.querySelector('iframe').getAttribute('src')).toBe('blob:publication#toolbar=0');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    fixture.nativeElement.querySelector('iframe').dispatchEvent(new Event('load'));
    fixture.nativeElement.querySelector('iframe').dispatchEvent(new Event('load'));
    expect(telemetry.track).toHaveBeenCalledTimes(1);
    expect(telemetry.track).toHaveBeenCalledWith('publication_view', {
      itemId: 'article-1', issue: '1.1', documentType: 'article', authenticated: true
    });
    component.close();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:publication');
  });

  it('views contents after login and logs its issue without including its URL', () => {
    component.url = 'https://example.com/contents.pdf';
    component.issue = '2.4';
    component.documentType = 'contents';
    component.view();
    http.expectOne(component.url).flush(new Blob(['%PDF-1.4']));
    expect(fileUrls.getPdfUrlByItemId).not.toHaveBeenCalled();
    component.onViewerLoad();
    expect(telemetry.track).toHaveBeenCalledWith('publication_view', {
      itemId: undefined, issue: '2.4', documentType: 'contents', authenticated: true
    });
    component.ngOnChanges();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:publication');
  });

  it('surfaces PDF fetch failures and permits retry', () => {
    component.url = 'https://example.com/contents.pdf';
    component.view();
    http.expectOne(component.url).flush(new Blob(['Unavailable']), { status: 503, statusText: 'Unavailable' });
    expect(notifications.backendError).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    component.onViewerLoad();
    expect(telemetry.track).not.toHaveBeenCalled();
  });

  it('blocks logged-out article and direct URL views before fetching any PDF', () => {
    auth.isAuthenticated = false;
    user.next({});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Log in to view');
    component.itemId = 'article-1';
    component.view();
    component.itemId = undefined;
    component.url = 'https://example.com/editorial.pdf';
    component.view();
    expect(fileUrls.getPdfUrlByItemId).not.toHaveBeenCalled();
    http.expectNone(component.url);
    expect(notifications.warning).toHaveBeenCalledTimes(2);
    expect(telemetry.track).not.toHaveBeenCalled();
    expect(component.viewerUrl).toBeFalsy();
  });

  it('cancels in-flight viewing on logout without emitting a view log', () => {
    component.url = 'https://example.com/editorial.pdf';
    component.view();
    const request = http.expectOne(component.url);
    auth.isAuthenticated = false;
    user.next({});
    expect(request.cancelled).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.viewerUrl).toBeFalsy();
    component.onViewerLoad();
    expect(telemetry.track).not.toHaveBeenCalled();
  });

  it('closes on logout and logs a new opening after signing back in', () => {
    component.url = 'https://example.com/editorial.pdf';
    component.issue = '1.1';
    component.documentType = 'editorial';
    component.view();
    http.expectOne(component.url).flush(new Blob(['%PDF-1.4']));
    component.onViewerLoad();
    auth.isAuthenticated = false;
    user.next({});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:publication');
    auth.isAuthenticated = true;
    user.next({ email: 'reader@example.com' });
    component.view();
    http.expectOne(component.url).flush(new Blob(['%PDF-1.4']));
    component.onViewerLoad();
    expect(telemetry.track).toHaveBeenCalledTimes(2);
    expect(telemetry.track).toHaveBeenCalledWith('publication_view', {
      itemId: undefined, issue: '1.1', documentType: 'editorial', authenticated: true
    });
  });
});
