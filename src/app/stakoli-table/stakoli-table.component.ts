import { WeekDay } from '@angular/common';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { threadId } from 'worker_threads';
import { Department, Person } from '../data-models/department';
import { SubmitDialogOption, SubmitDialogResult } from '../modals/submit-dialog-modal/submit-dialog-modal.component';
import { DataService, ModalModes } from '../services/data.service';

@Component({
  selector: 'app-stakoli-table',
  templateUrl: './stakoli-table.component.html',
  styleUrls: ['./stakoli-table.component.css']
})
export class StakoliTableComponent implements OnInit {

  days: any[] = [];
  leapyear: boolean = false;
  weeks: {week: number, begin: Date, end: Date}[] = [];

  viewType: string;
  searchValue: string = "";
  sortOrder: string = "name";

  selectedDepartmentIndex = 0;
  selectedWeek: number = 0;
  selectedMonth: number = 0;
  todayIndex: number = -1;

  addDepartmentActive: boolean = false;
  newDepartmentName: string = "";
  lastDepartmentClick: {index: number, time: Date} = {index: -1, time: new Date()};
  modifingDepartmentIndex = -1;

  submitDialogOpen: boolean = false;

  date = Date;
  con = console;
  array = Array;
  SubmitDialogOption = SubmitDialogOption;

  constructor(public dataService: DataService) {
    this.viewType = dataService.getLocalStorage("stakoliViewType", "week");
  }

  ngOnInit(): void {
    this.calcYear();

    this.dataService.OnNewDataApplied.subscribe(() => {
      this.selectedDepartmentIndex = 0;
      this.calcYear();
    });
  }

  calcYear() {
    this.days = [];
    this.weeks = [];
    this.todayIndex = -1;
    this.selectedWeek = 0;
    
    this.leapyear = this.dataService.year % 4 === 0 && (this.dataService.year % 100 !== 0 || this.dataService.year % 1000 === 0);

    for (let month = 0; month < 12; ++month) {
      for (let day = 1; day <= 31; ++day) {
        if (day === 31 && ((month < 6 && month % 2 === 1) || (month > 7 && month % 2 === 0))) {
          break;
        }
        if (month === 1 && ((day === 29 && !this.leapyear) || day === 30)) {
          break;
        }

        let dayObj = new Date(this.dataService.year, month, day);
        let week = this.getWeek(dayObj, this.days.length);

        this.days.push(dayObj);

        if (this.weeks.length === 0 || this.weeks[this.weeks.length - 1].week !== week) {
          this.weeks.push({week: week, begin: dayObj, end: dayObj});new Date(2019, 8, 15) 
        }
        else {
          this.weeks[this.weeks.length - 1].end = dayObj;
        }

        let today = new Date();
        let todayString = today.toDateString();

        if (dayObj.toDateString() === todayString) {
          this.todayIndex = this.days.length - 1;
          this.selectedWeek = this.getWeek(today, this.todayIndex);
          
          if (this.weeks[0].week === 52) {
            this.selectedWeek = (this.selectedWeek + 1) % 53;
          }
        }
      }
    }

    if (this.dataService.year === new Date().getFullYear()) {
      this.selectedMonth = new Date().getMonth();
    }
    else {
      this.selectedMonth = 0;
    }
  }

  getWeek(day: Date, dayIndex: number): number {
    let week = Math.floor((dayIndex - ((day.getDay() + 6) % 7)) / 7);
    if (week < 0) {
      week = 52;
    }
    return week;
  }

  setSelectedWeek(event: Event): void {
    this.selectedWeek = (event.target as HTMLSelectElement).selectedIndex;
  }

  setSelectedMonth(event: Event): void {
    this.selectedMonth = (event.target as HTMLSelectElement).selectedIndex;
  }

  getSelectedWeek(): Date[] {
    let weekArray: Date[] = [];

    for (let i = (this.selectedWeek - 1) * 7; ; ++i) {
      if (this.days[i] >= this.weeks[this.selectedWeek].begin) {
        weekArray.push(this.days[i]);

        if (this.days[i] === this.weeks[this.selectedWeek].end) {
          break;
        }
      }
    }

    return weekArray;
  }

  getSelectedMonth(): Date[] {
    let monthArray: Date[] = [];
    let wasOnce: boolean = false;

    for (let i = (this.selectedMonth * 29); i < this.days.length ; ++i) {
      if (this.days[i].getMonth() === this.selectedMonth) {
        wasOnce = true;
        monthArray.push(this.days[i]);
      }
      else if(wasOnce) {
        break;
      }
    }

    return monthArray;
  }

  addDepartment() {
    if (this.addDepartmentActive) {
      if (this.newDepartmentName !== "") {
        this.dataService.data.push(new Department(this.newDepartmentName));
        this.selectedDepartmentIndex = this.dataService.data.length - 1;
        this.addDepartmentActive = false;
        this.newDepartmentName = "";
      }
    }
    else {
      this.addDepartmentActive = true;
    }
  }

  cancelAddDepartment() {
    this.addDepartmentActive = false;
    this.newDepartmentName = "";
  }

  deleteDepartment() {
    this.submitDialogOpen = true;
  }

  OnSubmitDialogResult(result: SubmitDialogResult) {
    if (result === SubmitDialogResult.Yes) {
      this.dataService.data.splice(this.selectedDepartmentIndex, 1);
      if (this.selectedDepartmentIndex === this.dataService.data.length) {
        --this.selectedDepartmentIndex;
      }
    }

    this.submitDialogOpen = false;
  }

  clickOnDepartment(index: number, event: Event) {
    if (this.lastDepartmentClick.index === index && (new Date().getTime() - this.lastDepartmentClick.time.getTime()) / 1000 < 1) {
      this.modifingDepartmentIndex = index;
      this.newDepartmentName = this.dataService.data[index].name;
    }
    else {
      this.selectedDepartmentIndex = index;
      this.lastDepartmentClick = {index: index, time: new Date()};
    }
  }

  changeDepartmentName() {
    if (! this.dataService.data[this.modifingDepartmentIndex]) {
      return;
    }

    this.dataService.data[this.modifingDepartmentIndex].name = this.newDepartmentName;
    this.newDepartmentName = "";
    this.modifingDepartmentIndex = -1;
  }

  cancleChangeDepartmentName() {
    this.newDepartmentName = "";
    this.modifingDepartmentIndex = -1;
  }

  addPerson() {
    this.dataService.OnAddPersonEvent = (p: Person | undefined) => {
      this.dataService.OnAddPersonEvent = undefined;

      if (p) {
        this.dataService.data[this.selectedDepartmentIndex].addPerson(p);
      }

      this.dataService.modalMode.next(ModalModes.NONE);
    }
    this.dataService.modalMode.next(ModalModes.PERSON);
  }

  editPerson(index: number) {
    this.dataService.selectedPerson = {departmentIndex: this.selectedDepartmentIndex, personIndex: index};
    this.dataService.modalMode.next(ModalModes.PERSON_MAIN);
  }

  newDate(year: number, month: number = 0, day: number = 1): Date {
    return new Date(year, month, day);
  }

  changeViewType() {
    window.localStorage.setItem("stakoliViewType", this.viewType);
  }

  matchesSearchQuery(person: Person): boolean {
    if (this.searchValue === "") {
      return true;
    }

    for (let word of this.searchValue.split(" ")) {
      word = word.toLocaleLowerCase();

      if (! (person.lastName.toLocaleLowerCase().includes(word)
          || person.firstName.toLocaleLowerCase().includes(word)
          || person.rank.includes(word)
          || this.dataService.getRankLong(person.rank).toLocaleLowerCase().includes(word)
          || person.position.toLocaleLowerCase().includes(word)))
        {
          return false;
        }
    }

    return true;
  }



  sortedNamesList: Person[] = [];
  sortedFunctionsList: Person[] = [];
  prevNameSum = 0;
  prevFunctionSum = 0;

  getPersons(): Person[] {
    switch (this.sortOrder) {
      case "name":
        return this.sortNames();
      case "name desc":
        return this.sortNames().reverse();
      case "function":
        return this.sortFunctions();
      case "function desc":
        return this.sortFunctions().reverse();
      case "added":
        return this.dataService.data[this.selectedDepartmentIndex].persons;
      default:
        return this.sortNames();
    }
  }

  sortFunctions(): Person[] {
    if (this.prevFunctionSum !== this.dataService.data[this.selectedDepartmentIndex].getDepartmentNamesHash()) {
      this.prevFunctionSum = this.dataService.data[this.selectedDepartmentIndex].getDepartmentNamesHash();
      this.sortedFunctionsList = [];

      for (let pers of this.dataService.data[this.selectedDepartmentIndex].persons) {
        this.sortedFunctionsList.push(pers);
      }
      
      this.sortedFunctionsList.sort(
        (a: Person, b: Person) => {
          if (a.position.toLocaleLowerCase() > b.position.toLocaleLowerCase()) {
            return 1;
          }
          else if (a.position.toLocaleLowerCase() < b.position.toLocaleLowerCase()) {
            return -1;
          }
          else {
            return 0;
          }
        }
      );
    }

    return this.sortedFunctionsList;
  }

  sortNames(): Person[] {
    if (this.prevNameSum !== this.dataService.data[this.selectedDepartmentIndex].getDepartmentNamesHash()) {
      this.prevNameSum = this.dataService.data[this.selectedDepartmentIndex].getDepartmentNamesHash();
      this.sortedNamesList = [];

      for (let pers of this.dataService.data[this.selectedDepartmentIndex].persons) {
        this.sortedNamesList.push(pers);
      }
      
      this.sortedNamesList.sort(
        (a: Person, b: Person) => {
          if (a.getFullNameString().toLocaleLowerCase() > b.getFullNameString().toLocaleLowerCase()) {
            return 1;
          }
          else if (a.getFullNameString().toLocaleLowerCase() < b.getFullNameString().toLocaleLowerCase()) {
            return -1;
          }
          else {
            return 0;
          }
        }
      );
    }
    
    return this.sortedNamesList;
  }

  getPersonIndex(person: Person): number {
    return this.dataService.data[this.selectedDepartmentIndex].persons.indexOf(person, undefined);
  }

  OnNewDepartmentBlur(relatedTarget: EventTarget | null) {
    if (relatedTarget && (relatedTarget as HTMLElement).classList.contains("addDepartmentSmallBtn")) {
      return;
    }
    this.cancelAddDepartment();
  }

}
