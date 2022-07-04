import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDialogModalComponent } from './submit-dialog-modal.component';

describe('SubmitDialogModalComponent', () => {
  let component: SubmitDialogModalComponent;
  let fixture: ComponentFixture<SubmitDialogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitDialogModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitDialogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
