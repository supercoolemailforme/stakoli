import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-attendance-picker',
  templateUrl: './attendance-picker.component.html',
  styleUrls: ['./attendance-picker.component.css']
})
export class AttendancePickerComponent implements OnInit {


  @Input() value: string = "";
  @Output() valueChange = new EventEmitter<string>();

  static lastActivePicker: AttendancePickerComponent;

  pickerOpen: boolean = false;
  pickerClose: boolean = false;

  dataService: DataService;


  constructor(data: DataService) {
    this.dataService = data;
  }

  ngOnInit(): void {}

  togglePicker() {
    this.pickerOpen = true;
    setTimeout(() => {
      this.pickerOpen = false;
    }, 10);
    /*
    if (this.pickerOpen) {
      if (AttendancePickerComponent.lastActivePicker && AttendancePickerComponent.lastActivePicker !== this) {
        AttendancePickerComponent.lastActivePicker.closePicker();
      }
      
      AttendancePickerComponent.lastActivePicker = this;
    }*/
  }

  closePicker() {
    this.pickerClose = true;
    setTimeout(() => {
      this.pickerClose = false;
    }, 10);
  }

  setValue(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(newValue);
    this.pickerOpen = false;
  }

}
