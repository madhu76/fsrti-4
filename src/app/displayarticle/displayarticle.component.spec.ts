import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayarticleComponent } from './displayarticle.component';

describe('DisplayarticleComponent', () => {
  let component: DisplayarticleComponent;
  let fixture: ComponentFixture<DisplayarticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayarticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayarticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
