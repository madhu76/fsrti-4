import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol1Issue4Component } from './vol1-issue4.component';

describe('Vol1Issue3Component', () => {
  let component: Vol1Issue4Component;
  let fixture: ComponentFixture<Vol1Issue4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol1Issue4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol1Issue4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
