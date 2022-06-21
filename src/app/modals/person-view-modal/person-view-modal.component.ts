import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'src/app/data-models/department';
import { DataService, ModalModes } from 'src/app/services/data.service';

@Component({
  selector: 'app-person-view-modal',
  templateUrl: './person-view-modal.component.html',
  styleUrls: ['./person-view-modal.component.css']
})
export class PersonViewModalComponent implements OnInit {

  @Input() _person: Person | undefined = undefined;
  @Output() personChanged: EventEmitter<Person> = new EventEmitter<Person>();
  get person(): Person {
    if (this._person === undefined) {
      return this.p;
    }
    else {
      return this._person;
    }
  }
  p: Person = new Person("");

  newPerson: boolean = false;

  rankSelectValue: string = "";
  rankInputValue: string = "";

  con = console;


  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.newPerson = this._person === undefined;

    if (this.person.rank !== "") {
      let rankIndex = this.dataService.getRankIndex(this.person.rank);

      if (rankIndex === -1) {
        this.rankSelectValue = "other";
        this.rankInputValue = this.person.rank;
      }
      else {
        this.rankSelectValue = this.dataService.ranks[rankIndex].short;
      }
    }
  }


  save(): void {
    if (this.person.lastName !== '') {
      if (this.rankSelectValue === "other") {
        this.person.rank = this.rankInputValue;
      }
      else {
        this.person.rank = this.rankSelectValue;
      }
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