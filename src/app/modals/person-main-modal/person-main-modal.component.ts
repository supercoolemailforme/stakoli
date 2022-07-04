import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'src/app/data-models/department';
import { DataService, ModalModes } from 'src/app/services/data.service';
import { SubmitDialogOption, SubmitDialogResult } from '../submit-dialog-modal/submit-dialog-modal.component';

@Component({
  selector: 'app-person-main-modal',
  templateUrl: './person-main-modal.component.html',
  styleUrls: ['./person-main-modal.component.css']
})
export class PersonMainModalComponent implements OnInit {

  @Input() selectedPerson: {departmentIndex: number, personIndex: number} = {departmentIndex: -1, personIndex: -1};

  selectedSiteIndex = 0;
  attendanceLength = 0;
  attendanceSummary: number[] = [];

  SubmitDialogOption = SubmitDialogOption;
  submitDialogOpen: boolean = false;

  get person(): Person {
    return this.dataService.data[this.selectedPerson.departmentIndex].persons[this.selectedPerson.personIndex];
  }

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.createAttendanceSummary();
  }

  createAttendanceSummary() {
    this.attendanceSummary = [];
    
    for (let i = this.dataService.attendanceTypes.length; i > 0; --i) {
      this.attendanceSummary.push(0);
    }

    this.attendanceLength = Object.keys(this.person.attendances).length;

    for (let att of Object.keys(this.person.attendances)) {
      ++this.attendanceSummary[this.dataService.attendanceTypes.indexOf(this.person.attendances[att])];
    }
  }


  editPerson(): void {
    this.dataService.editPerson = Person.copyPerson(this.dataService.data[this.selectedPerson.departmentIndex].persons[this.selectedPerson.personIndex]);
    this.dataService.OnAddPersonEvent = (p: Person | undefined) => {
      this.dataService.OnAddPersonEvent = undefined;
      this.dataService.editPerson = undefined;

      if (p) {
        this.dataService.data[this.selectedPerson.departmentIndex].persons[this.selectedPerson.personIndex] = p;
      }

      this.dataService.modalMode.next(ModalModes.PERSON_MAIN);
    }
    this.dataService.modalMode.next(ModalModes.PERSON);
  }

  cancel(): void {
    this.dataService.modalMode.next(ModalModes.NONE);
    this.dataService.selectedPerson = undefined;
  }

  deletePerson(): void {
    this.submitDialogOpen = true;
  }

  OnSubmitDialogResult(result: SubmitDialogResult) {
    if (result === SubmitDialogResult.Yes) {
      this.dataService.data[this.selectedPerson.departmentIndex].persons.splice(this.selectedPerson.personIndex, 1);
      this.cancel();
    }

    this.submitDialogOpen = false;
  }

  switchDepartment(event: Event) {
    let newDepIdx = (event.target as HTMLSelectElement).selectedIndex;
    this.dataService.data[newDepIdx].addPerson(this.person);

    this.dataService.selectedPerson = {departmentIndex: newDepIdx, personIndex: this.dataService.data[newDepIdx].persons.length - 1};

    this.dataService.data[this.selectedPerson.departmentIndex].persons.splice(this.selectedPerson.personIndex, 1);
  }

  prevPerson(): void {
    if (this.selectedPerson && this.selectedPerson.personIndex !== 0) {
      this.selectedPerson = {departmentIndex: this.selectedPerson.departmentIndex, personIndex: this.selectedPerson.personIndex - 1};
      this.dataService.selectedPerson = this.selectedPerson;
      this.createAttendanceSummary();
    }
  }

  nextPerson(): void {
    if (this.selectedPerson && this.selectedPerson.personIndex !== this.dataService.data[this.selectedPerson.departmentIndex].persons.length - 1) {
      this.selectedPerson = {departmentIndex: this.selectedPerson.departmentIndex, personIndex: this.selectedPerson.personIndex + 1};
      this.dataService.selectedPerson = this.selectedPerson;
      this.createAttendanceSummary();
    }
  }

}
