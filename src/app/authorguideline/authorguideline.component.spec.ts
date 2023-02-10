import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorguidelineComponent } from './authorguideline.component';

describe('AuthorguidelineComponent', () => {
  let component: AuthorguidelineComponent;
  let fixture: ComponentFixture<AuthorguidelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorguidelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorguidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
