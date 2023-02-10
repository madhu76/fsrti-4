import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol2Issue1Component } from './vol2-issue1.component';

describe('Vol2Issue1Component', () => {
  let component: Vol2Issue1Component;
  let fixture: ComponentFixture<Vol2Issue1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol2Issue1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol2Issue1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
