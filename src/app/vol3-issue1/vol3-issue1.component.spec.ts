import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol3Issue1Component } from './vol3-issue1.component';

describe('Vol3Issue1Component', () => {
  let component: Vol3Issue1Component;
  let fixture: ComponentFixture<Vol3Issue1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol3Issue1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol3Issue1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
