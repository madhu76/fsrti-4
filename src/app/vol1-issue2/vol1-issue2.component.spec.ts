import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol1Issue2Component } from './vol1-issue2.component';

describe('Vol1Issue2Component', () => {
  let component: Vol1Issue2Component;
  let fixture: ComponentFixture<Vol1Issue2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol1Issue2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol1Issue2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
