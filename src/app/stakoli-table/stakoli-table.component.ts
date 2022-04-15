import { WeekDay } from '@angular/common';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { threadId } from 'worker_threads';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-stakoli-table',
  templateUrl: './stakoli-table.component.html',
  styleUrls: ['./stakoli-table.component.css']
})
export class StakoliTableComponent implements OnInit {

  dataService: DataService;
  days: any[] = [];
  year: number = 2022;
  leapyear: boolean = false;
  weeks:any = [];

  selectedWeek: number = 0;
  todayIndex: number = -1;

  date = Date;
  con = console;
  array = Array;

  constructor(ds: DataService) {
    this.dataService = ds;
  }

  ngOnInit(): void {
    this.calcYear();
  }

  calcYear() {
    this.days = [];
    this.weeks = [];
    this.todayIndex = -1;
    
    this.leapyear = this.year % 4 === 0 && (this.year % 100 !== 0 || this.year % 1000 === 0);

    for (let month = 0; month < 12; ++month) {
      for (let day = 1; day <= 31; ++day) {
        if (day === 31 && ((month < 6 && month % 2 === 1) || (month > 7 && month % 2 === 0))) {
          break;
        }
        if (month === 2 && (day === 29 && !this.leapyear || day === 30)) {
          break;
        }

        let dayObj = new Date(this.year, month, day);
        let week = this.getWeek(dayObj, this.days.length);

        this.days.push(dayObj);

        if (this.weeks.length === 0 || this.weeks[this.weeks.length - 1].week !== week) {
          this.weeks.push({week: week, begin: dayObj, end: dayObj});
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

  getWeek(day: Date, dayIndex: number):number {
    let week = Math.floor((dayIndex - ((day.getDay() + 6) % 7)) / 7);
    if (week < 0) {
      week = 52;
    }
    return week;
  }

  setSelecteWeek(event: Event) {
    this.selectedWeek = (event.target as HTMLSelectElement).selectedIndex;
  }

  getArray(length: number): Array<any> {
    return new Array(length);
  }

}