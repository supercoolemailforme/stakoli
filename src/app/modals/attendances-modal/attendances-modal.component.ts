import { Component, OnInit } from '@angular/core';
import { DataService, ModalModes } from 'src/app/services/data.service';

@Component({
  selector: 'app-attendances-modal',
  templateUrl: './attendances-modal.component.html',
  styleUrls: ['./attendances-modal.component.css']
})
export class AttendancesModalComponent implements OnInit {

  constructor(public dataService: DataService) { }

  attendanceEditIndex: number = -1;
  newAttendanceInput: string = "";
  editAttendanceInput: string = "";

  ngOnInit(): void {
  }

  close() {
    this.dataService.modalMode.next(ModalModes.NONE);
  }

  editAttendance(index: number) {
    this.attendanceEditIndex = index;
    this.editAttendanceInput = this.dataService.attendanceTypes[index];
  }

  saveEditing(relatedTarget: EventTarget | null = null, index: number = -1) {
    if ((relatedTarget && (relatedTarget as HTMLElement).classList.contains("deleteBtn")) || !this.isAttendanceValid(this.editAttendanceInput, index)) {
      return;
    }
    for (let department of this.dataService.data) {
      for (let person of department.persons) {
        for (let dayKey of Object.keys(person.attendances)) {
          if (person.attendances[dayKey] === this.dataService.attendanceTypes[this.attendanceEditIndex]) {
            person.attendances[dayKey] = this.editAttendanceInput;
          }
        }
      }
    }

    this.dataService.attendanceTypes[this.attendanceEditIndex] = this.editAttendanceInput;

    this.endEditing();
  }

  endEditing() {
    this.attendanceEditIndex = -1;
  }

  addAttendance() {
    this.dataService.attendanceTypes.push(this.newAttendanceInput);
    this.newAttendanceInput = "";
  }

  deleteAttendance(index: number): void {
    for (let department of this.dataService.data) {
      for (let person of department.persons) {
        for (let dayKey of Object.keys(person.attendances)) {
          if (person.attendances[dayKey] === this.dataService.attendanceTypes[this.attendanceEditIndex]) {
            person.attendances[dayKey] = undefined;
          }
        }
      }
    }
    this.dataService.attendanceTypes.splice(index, 1);
    this.endEditing();
  }

  isAttendanceValid(currentValue: string, currentItem: number = -1) {
    if (currentValue === "" || currentValue === "-") {
      return false;
    }
    
    let index = this.dataService.attendanceTypes.indexOf(currentValue);

    return index === -1 || index === currentItem;
  }

}
