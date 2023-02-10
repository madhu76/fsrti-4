import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialboardComponent } from './editorialboard.component';

describe('EditorialboardComponent', () => {
  let component: EditorialboardComponent;
  let fixture: ComponentFixture<EditorialboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorialboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
