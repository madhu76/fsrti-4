import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol2Issue2Component } from './vol2-issue2.component';

describe('Vol2Issue2Component', () => {
  let component: Vol2Issue2Component;
  let fixture: ComponentFixture<Vol2Issue2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol2Issue2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol2Issue2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
