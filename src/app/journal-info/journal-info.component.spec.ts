import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalInfoComponent } from './journal-info.component';

describe('JournalInfoComponent', () => {
  let component: JournalInfoComponent;
  let fixture: ComponentFixture<JournalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
