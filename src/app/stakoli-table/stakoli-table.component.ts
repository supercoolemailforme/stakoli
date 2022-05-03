import { WeekDay } from '@angular/common';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { threadId } from 'worker_threads';
import { Department, Person } from '../data-models/department';
import { DataService, ModalModes } from '../services/data.service';

@Component({
  selector: 'app-stakoli-table',
  templateUrl: './stakoli-table.component.html',
  styleUrls: ['./stakoli-table.component.css']
})
export class StakoliTableComponent implements OnInit {

  dataService: DataService;
  days: any[] = [];
  leapyear: boolean = false;
  weeks: {week: number, begin: Date, end: Date}[] = [];

  selectedDepartmentIndex = 0;
  selectedWeek: number = 0;
  todayIndex: number = -1;

  addDepartmentActive: boolean = false;
  newDepartmentName: string = "";
  lastDepartmentClick: {index: number, time: Date} = {index: -1, time: new Date()};
  modifingDepartmentIndex = -1;

  date = Date;
  con = console;
  array = Array;

  constructor(ds: DataService) {
    this.dataService = ds;
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

          setTimeout(() => {
            this.selectedWeek = this.getWeek(today, this.todayIndex);
            
            if (this.weeks[0].week === 52) {
              this.selectedWeek = (this.selectedWeek + 1) % 53;
            }
          }, 10);
        }
      }
    }
  }

  getWeek(day: Date, dayIndex: number): number {
    let week = Math.floor((dayIndex - ((day.getDay() + 6) % 7)) / 7);
    if (week < 0) {
      week = 52;
    }
    return week;
  }

  setSelectedWeek(event: Event) {
    this.selectedWeek = (event.target as HTMLSelectElement).selectedIndex;
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
    this.dataService.data.splice(this.selectedDepartmentIndex, 1);
    if (this.selectedDepartmentIndex === this.dataService.data.length) {
      --this.selectedDepartmentIndex;
    }
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

}
