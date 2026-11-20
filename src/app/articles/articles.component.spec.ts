import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ApiDataService } from '../Services/api-data.service';
import { AuthService } from '../Services/auth.service';
import { DownloadFileService } from '../Services/download-file.service';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';
import { ArticlesComponent } from './articles.component';

@Component({ selector: 'app-pdf-viewer', template: '<button>View</button>' })
class PdfViewerStub {
  @Input() url: string;
}

describe('ArticlesComponent public access', () => {
  let fixture: ComponentFixture<ArticlesComponent>;
  let route: BehaviorSubject<{ vol_issue: string }>;
  let policy: Subject<string[]>;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(async(() => {
    route = new BehaviorSubject({ vol_issue: '1.1' });
    policy = new Subject<string[]>();
    notifications = jasmine.createSpyObj('Notifications', ['backendError']);
    TestBed.configureTestingModule({
      declarations: [ArticlesComponent, PdfViewerStub],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: route } },
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: ApiDataService, useValue: { getData: () => of([]) } },
        { provide: DownloadFileService, useValue: {} },
        { provide: FileUrlService, useValue: { publicViewVolumes$: policy } },
        { provide: NotificationService, useValue: notifications }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesComponent);
    fixture.detectChanges();
  });

  it('uses View for contents and editorials across all issues of public volumes', () => {
    policy.next(['1', '2']);
    for (const issue of ['1.1', '1.2', '1.3', '1.4', '2.1', '2.2', '2.3', '2.4']) {
      route.next({ vol_issue: issue });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('app-pdf-viewer').length).toBe(issue === '1.1' ? 2 : 1);
      expect(fixture.nativeElement.querySelector('[download]')).toBeNull();
    }
  });

  it('keeps later volume downloads unless that volume is added to the policy', () => {
    route.next({ vol_issue: '3.2' });
    policy.next(['1', '2']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[download]').length).toBe(2);
    expect(fixture.nativeElement.querySelector('app-pdf-viewer')).toBeNull();
    policy.next(['1', '2', '3']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[download]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-pdf-viewer').length).toBe(2);
  });

  it('reports policy errors without falling back to download links', () => {
    policy.error({ status: 500 });
    fixture.detectChanges();
    expect(notifications.backendError).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[download]')).toBeNull();
  });
});
