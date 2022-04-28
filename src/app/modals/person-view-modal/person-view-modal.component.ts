import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'src/app/data-models/department';
import { DataService, ModalModes } from 'src/app/services/data.service';

@Component({
  selector: 'app-person-view-modal',
  templateUrl: './person-view-modal.component.html',
  styleUrls: ['./person-view-modal.component.css']
})
export class PersonViewModalComponent implements OnInit {

  @Input() person: Person = new Person("");
  @Output() personChanged: EventEmitter<Person> = new EventEmitter<Person>();


  constructor(private dataService: DataService) { }

  ngOnInit(): void { }


  save(): void {
    if (this.person.lastName !== '') {
      this.personChanged.emit(this.person);
    }
  }

  cancel(): void {
    this.personChanged.emit(undefined);
  }

  selectNextInput(event: Event) {
    let element = event.target as HTMLElement;
    let superParent = element.parentElement?.parentElement?.parentElement as HTMLElement;

    let inputList = superParent.getElementsByTagName("input");

    for (let i = 0; i < inputList.length - 1; ++i) {
      if (inputList[i] == element) {
        inputList[i + 1].focus();
      }
    }
  }

}