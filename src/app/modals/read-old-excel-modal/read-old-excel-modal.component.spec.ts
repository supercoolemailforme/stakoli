import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOldExcelModalComponent } from './read-old-excel-modal.component';

describe('ReadOldExcelModalComponent', () => {
  let component: ReadOldExcelModalComponent;
  let fixture: ComponentFixture<ReadOldExcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadOldExcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOldExcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
