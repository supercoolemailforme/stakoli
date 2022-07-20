import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-attendance-picker',
  templateUrl: './attendance-picker.component.html',
  styleUrls: ['./attendance-picker.component.css']
})
export class AttendancePickerComponent implements OnInit {


  @Input() value: string | undefined = "";
  @Input() weekend: boolean = false;
  @Input() tooltip: string = "";
  @Output() valueChange = new EventEmitter<string>();

  static selectedSite: number = 0;
  get lastSiteIndex(): number {
    return Math.floor(this.dataService.attendanceTypes.length / 4);
  }

  generate: boolean = false;
  pickerClose: boolean = false;

  dataService: DataService;
  atc = AttendancePickerComponent;


  constructor(data: DataService) {
    this.dataService = data;
  }

  ngOnInit(): void {}

  closePicker() {
    this.pickerClose = true;
    setTimeout(() => {
      this.pickerClose = false;
    }, 10);
  }
  
  setValue(newValue: string | undefined) {
    this.value = newValue;
    this.valueChange.emit(newValue);
    this.closePicker();
  }

  incrementSite() {
    if (this.atc.selectedSite === this.lastSiteIndex) {
      this.atc.selectedSite = 0;
    }
    else {
      ++this.atc.selectedSite;
    }
  }

  decrementSite() {
    if (this.atc.selectedSite === 0) {
      this.atc.selectedSite = this.lastSiteIndex;
    }
    else {
      --this.atc.selectedSite;
    }
  }

}
