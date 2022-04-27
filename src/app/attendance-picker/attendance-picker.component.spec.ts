import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePickerComponent } from './attendance-picker.component';

describe('AttendancePickerComponent', () => {
  let component: AttendancePickerComponent;
  let fixture: ComponentFixture<AttendancePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
