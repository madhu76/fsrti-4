import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractingComponent } from './abstracting.component';

describe('AbstractingComponent', () => {
  let component: AbstractingComponent;
  let fixture: ComponentFixture<AbstractingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
