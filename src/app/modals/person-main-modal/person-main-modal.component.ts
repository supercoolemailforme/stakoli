import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'src/app/data-models/department';
import { DataService, ModalModes } from 'src/app/services/data.service';

@Component({
  selector: 'app-person-main-modal',
  templateUrl: './person-main-modal.component.html',
  styleUrls: ['./person-main-modal.component.css']
})
export class PersonMainModalComponent implements OnInit {

  @Input() selectedPerson: {departmentIndex: number, personIndex: number} = {departmentIndex: -1, personIndex: -1};

  selectedSiteIndex = 0;

  get person(): Person {
    return this.dataService.data[this.selectedPerson.departmentIndex].persons[this.selectedPerson.personIndex];
  }

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }


  editPerson(): void {
    this.dataService.editPerson = JSON.parse(JSON.stringify(this.dataService.data[this.selectedPerson.departmentIndex].persons[this.selectedPerson.personIndex]));
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

}
