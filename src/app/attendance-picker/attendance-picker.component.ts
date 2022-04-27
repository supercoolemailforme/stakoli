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

  pickerOpen: boolean = false;

  dataService: DataService;


  constructor(data: DataService) {
    this.dataService = data;
  }

  ngOnInit(): void {}

  togglePicker() {
    this.pickerOpen = !this.pickerOpen;
  }

  closePicker() {
    this.pickerOpen = false;
  }

  setValue(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(newValue);
    this.pickerOpen = false;
  }

}
