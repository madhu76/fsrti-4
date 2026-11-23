import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../Services/auth.service';
import { ApiDataService } from '../Services/api-data.service';
import { NotificationService } from '../Services/notification.service';
import { MySubmissionsComponent } from './my-submissions.component';

describe('MySubmissionsComponent table', () => {
  let fixture: ComponentFixture<MySubmissionsComponent>;
  let component: MySubmissionsComponent;

  beforeEach(async(() => {
    spyOn(MySubmissionsComponent.prototype, 'ngOnInit');
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MySubmissionsComponent],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: ApiDataService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: NgbModal, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySubmissionsComponent);
    component = fixture.componentInstance;
    component.managingEditors = [
      { email: 'managing@example.com', name: 'Managing Person', streams: [] }
    ];
    component.associateEditors = [
      { email: 'handling@example.com', name: 'Handling Person', streams: [] }
    ];
    component.filteredSubmissions = [{
      _id: 'MS-1', submittedBy: 'author@example.com', title: 'Sample manuscript',
      authors: 'Author', abstract: '', keywords: '', status: 'Under Review',
      articleUrl: '', isLoading: false, updateStatus: '', reviewUrls: [],
      revisionUrls: [], articleType: '', articleStream: '', updatedAt: new Date(),
      managingEditor: 'managing@example.com', associateEditor: 'handling@example.com'
    }];
  });

  afterEach(() => fixture.destroy());

  [true, false].forEach(isAdmin => {
    it(`shows separate editor names and preserves assignment permissions for ${isAdmin ? 'admins' : 'handling editors'}`, () => {
      component.isAdmin = isAdmin;
      component.isAssociateEditor = !isAdmin;
      const assign = spyOn(component, 'openAssignEditorModal');
      fixture.detectChanges();
      const table: HTMLTableElement = fixture.nativeElement.querySelector('table');
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
      const cells = table.querySelectorAll('tbody tr:first-child td');
      expect(headers.slice(6, 8)).toEqual(['Managing Editor', 'Handling Editor']);
      expect(cells.length).toBe(headers.length);
      expect(cells[6].textContent).toContain('Managing Person');
      expect(cells[6].textContent).not.toContain('Handling Person');
      expect(cells[7].textContent).toContain('Handling Person');
      expect(cells[7].textContent).not.toContain('Managing Person');
      [cells[6], cells[7]].forEach(cell => {
        const button = cell.querySelector('button');
        if (isAdmin) {
          button.click();
          expect(assign).toHaveBeenCalledWith(component.filteredSubmissions[0]);
        } else {
          expect(button).toBeNull();
        }
      });
    });
  });

  it('keeps the author table unchanged and spans all columns for empty results in each role', () => {
    fixture.detectChanges();
    const table: HTMLTableElement = fixture.nativeElement.querySelector('table');
    expect(table.querySelectorAll('th').length).toBe(5);
    expect(table.querySelectorAll('tbody tr:first-child td').length).toBe(5);
    expect(table.textContent).not.toContain('Managing Person');
    expect(table.textContent).not.toContain('Handling Person');
    component.filteredSubmissions = [];
    [false, true].forEach(isAdmin => {
      component.isAdmin = isAdmin;
      fixture.detectChanges();
      expect(table.querySelector<HTMLTableCellElement>('tbody td').colSpan)
        .toBe(table.querySelectorAll('th').length);
    });
  });

  it('scrolls the editorial table inside its wrapper only when it overflows', () => {
    component.isAdmin = true;
    fixture.detectChanges();
    const wrapper: HTMLDivElement = fixture.nativeElement.querySelector('.table-responsive');
    wrapper.style.width = '600px';
    expect(wrapper.scrollWidth).toBeGreaterThan(wrapper.clientWidth);
    wrapper.scrollLeft = 200;
    expect(wrapper.scrollLeft).toBeGreaterThan(0);
    wrapper.style.width = '2400px';
    expect(wrapper.scrollWidth).toBe(wrapper.clientWidth);
  });
});
