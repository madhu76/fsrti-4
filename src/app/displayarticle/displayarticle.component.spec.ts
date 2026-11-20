import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ApiDataService } from '../Services/api-data.service';
import { DownloadFileService } from '../Services/download-file.service';
import { FileUrlService } from '../Services/file-url.service';
import { NotificationService } from '../Services/notification.service';
import { DisplayarticleComponent } from './displayarticle.component';

@Component({ selector: 'app-pdf-viewer', template: '<button>View</button>' })
class PdfViewerStub {
  @Input() itemId: string;
}

describe('DisplayarticleComponent public access', () => {
  let component: DisplayarticleComponent;
  let fixture: ComponentFixture<DisplayarticleComponent>;
  let policy: Subject<string[]>;
  let downloads: jasmine.SpyObj<DownloadFileService>;
  let api: jasmine.SpyObj<ApiDataService>;

  beforeEach(async(() => {
    policy = new Subject<string[]>();
    downloads = jasmine.createSpyObj('DownloadFileService', ['downloadFileByItemId']);
    api = jasmine.createSpyObj('ApiDataService', ['getData']);
    api.getData.and.returnValue(of(JSON.stringify({ vol_issue: '1.1', item_id: 'article-1' })));
    TestBed.configureTestingModule({
      declarations: [DisplayarticleComponent, PdfViewerStub],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({ item_id: 'article-1' }) } },
        { provide: ApiDataService, useValue: api },
        { provide: DownloadFileService, useValue: downloads },
        { provide: FileUrlService, useValue: { publicViewVolumes$: policy } },
        { provide: NotificationService, useValue: jasmine.createSpyObj('Notifications', ['warning', 'backendError']) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayarticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('hides download until policy is loaded, then shows only View for public volumes', () => {
    expect(fixture.nativeElement.querySelector('#downloadpass')).toBeNull();
    policy.next(['1', '2']);
    for (const issue of ['1.1', '1.2', '1.3', '1.4', '2.1', '2.2', '2.3', '2.4']) {
      component.select.vol_issue = issue;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-pdf-viewer')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('#downloadpass')).toBeNull();
    }
    component.downloadFile(new Event('click'), 'article-1');
    expect(downloads.downloadFileByItemId).not.toHaveBeenCalled();
    expect(api.getData).toHaveBeenCalledTimes(1);
  });

  it('preserves downloads for later volumes and follows future policy changes', () => {
    policy.next(['1', '2']);
    component.select.vol_issue = '3.2';
    fixture.detectChanges();
    fixture.nativeElement.querySelector('#downloadpass').click();
    expect(downloads.downloadFileByItemId).toHaveBeenCalledWith('article-1');
    expect(api.getData).toHaveBeenCalledWith('/author/downloads/article-1');
    policy.next(['1', '2', '3']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#downloadpass')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-pdf-viewer')).not.toBeNull();
  });
});
