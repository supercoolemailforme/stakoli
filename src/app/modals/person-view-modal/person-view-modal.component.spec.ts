import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonViewModalComponent } from './person-view-modal.component';

describe('PersonViewModalComponent', () => {
  let component: PersonViewModalComponent;
  let fixture: ComponentFixture<PersonViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
