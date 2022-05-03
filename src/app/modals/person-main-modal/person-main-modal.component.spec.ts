import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonMainModalComponent } from './person-main-modal.component';

describe('PersonMainModalComponent', () => {
  let component: PersonMainModalComponent;
  let fixture: ComponentFixture<PersonMainModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonMainModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonMainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
