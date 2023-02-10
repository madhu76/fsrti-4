import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalOrderComponent } from './journal-order.component';

describe('JournalOrderComponent', () => {
  let component: JournalOrderComponent;
  let fixture: ComponentFixture<JournalOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
