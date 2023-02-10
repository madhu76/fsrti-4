import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol2Issue3Component } from './vol2-issue3.component';

describe('Vol2Issue3Component', () => {
  let component: Vol2Issue3Component;
  let fixture: ComponentFixture<Vol2Issue3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol2Issue3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol2Issue3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
