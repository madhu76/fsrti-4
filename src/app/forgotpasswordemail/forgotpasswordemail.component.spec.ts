import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordemailComponent } from './forgotpasswordemail.component';

describe('ForgotpasswordemailComponent', () => {
  let component: ForgotpasswordemailComponent;
  let fixture: ComponentFixture<ForgotpasswordemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpasswordemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpasswordemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
