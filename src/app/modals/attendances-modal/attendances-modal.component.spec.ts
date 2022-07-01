import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesModalComponent } from './attendances-modal.component';

describe('AttendancesModalComponent', () => {
  let component: AttendancesModalComponent;
  let fixture: ComponentFixture<AttendancesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
