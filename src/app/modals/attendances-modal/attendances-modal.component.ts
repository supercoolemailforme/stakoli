import { Component, OnInit } from '@angular/core';
import { DataService, ModalModes } from 'src/app/services/data.service';
import { SubmitDialogOption, SubmitDialogResult } from '../submit-dialog-modal/submit-dialog-modal.component';

@Component({
  selector: 'app-attendances-modal',
  templateUrl: './attendances-modal.component.html',
  styleUrls: ['./attendances-modal.component.css']
})
export class AttendancesModalComponent implements OnInit {

  attendanceEditIndex: number = -1;
  newAttendanceInput: string = "";
  editAttendanceInput: string = "";
  deleteAttendanceIndex: number = -1;

  SubmitDialogOption = SubmitDialogOption;
  SubmitDialogResult = SubmitDialogResult;


  constructor(public dataService: DataService) { }

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
    this.deleteAttendanceIndex = index;
    this.endEditing();
  }

  isAttendanceValid(currentValue: string, currentItem: number = -1) {
    if (currentValue === "" || currentValue === "-") {
      return false;
    }
    
    let index = this.dataService.attendanceTypes.indexOf(currentValue);

    return index === -1 || index === currentItem;
  }

  submitDialogCallback(result: SubmitDialogResult) {
    if (result === SubmitDialogResult.Yes) {
      for (let department of this.dataService.data) {
        for (let person of department.persons) {
          for (let dayKey of Object.keys(person.attendances)) {
            if (person.attendances[dayKey] === this.dataService.attendanceTypes[this.deleteAttendanceIndex]) {
              person.attendances[dayKey] = undefined;
            }
          }
        }
      }
      this.dataService.attendanceTypes.splice(this.deleteAttendanceIndex, 1);
    }

    this.deleteAttendanceIndex = -1;
  }

}
