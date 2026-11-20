import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';
import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let fixture: ComponentFixture<PdfViewerComponent>;
  let component: PdfViewerComponent;
  let http: HttpTestingController;
  let notifications: jasmine.SpyObj<NotificationService>;
  let fileUrls: jasmine.SpyObj<FileUrlService>;

  beforeEach(() => {
    notifications = jasmine.createSpyObj('Notifications', ['backendError']);
    fileUrls = jasmine.createSpyObj('FileUrlService', ['getPdfUrlByItemId']);
    fileUrls.getPdfUrlByItemId.and.returnValue(of('https://example.com/article.pdf'));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PdfViewerComponent],
      providers: [
        { provide: FileUrlService, useValue: fileUrls },
        { provide: NotificationService, useValue: notifications }
      ]
    });
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:publication');
    spyOn(URL, 'revokeObjectURL');
  });

  afterEach(() => {
    fixture.destroy();
    http.verify();
  });

  it('resolves an article and displays its PDF without download controls or navigation links', () => {
    component.itemId = 'article-1';
    component.view();
    http.expectOne('https://example.com/article.pdf').flush(new Blob(['%PDF-1.4']));
    fixture.detectChanges();
    expect(fileUrls.getPdfUrlByItemId).toHaveBeenCalledWith('article-1');
    expect(fixture.nativeElement.querySelector('iframe').getAttribute('src')).toBe('blob:publication#toolbar=0');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    component.close();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:publication');
  });

  it('views a contents URL without authentication and releases it on navigation', () => {
    component.url = 'https://example.com/contents.pdf';
    component.view();
    http.expectOne(component.url).flush(new Blob(['%PDF-1.4']));
    expect(fileUrls.getPdfUrlByItemId).not.toHaveBeenCalled();
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
  });
});
