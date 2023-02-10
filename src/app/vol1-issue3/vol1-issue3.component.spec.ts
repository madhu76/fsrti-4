import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol1Issue3Component } from './vol1-issue3.component';

describe('Vol1Issue3Component', () => {
  let component: Vol1Issue3Component;
  let fixture: ComponentFixture<Vol1Issue3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol1Issue3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol1Issue3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
