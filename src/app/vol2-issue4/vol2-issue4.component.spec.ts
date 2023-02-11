import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vol2Issue4Component } from './vol2-issue4.component';

describe('Vol2Issue4Component', () => {
  let component: Vol2Issue4Component;
  let fixture: ComponentFixture<Vol2Issue4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vol2Issue4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vol2Issue4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
