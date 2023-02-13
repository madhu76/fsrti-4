import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol3Issue2Component } from './vol3-issue2.component';

describe('Vol3Issue2Component', () => {
  let component: Vol3Issue2Component;
  let fixture: ComponentFixture<Vol3Issue2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol3Issue2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol3Issue2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
