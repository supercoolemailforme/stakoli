import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakoliTableComponent } from './stakoli-table.component';

describe('StakoliTableComponent', () => {
  let component: StakoliTableComponent;
  let fixture: ComponentFixture<StakoliTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakoliTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakoliTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
