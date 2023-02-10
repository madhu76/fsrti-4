import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationpoliciesComponent } from './publicationpolicies.component';

describe('PublicationpoliciesComponent', () => {
  let component: PublicationpoliciesComponent;
  let fixture: ComponentFixture<PublicationpoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationpoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationpoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
