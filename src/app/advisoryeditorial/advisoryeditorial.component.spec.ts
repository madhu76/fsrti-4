import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryeditorialComponent } from './advisoryeditorial.component';

describe('AdvisoryeditorialComponent', () => {
  let component: AdvisoryeditorialComponent;
  let fixture: ComponentFixture<AdvisoryeditorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisoryeditorialComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryeditorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
