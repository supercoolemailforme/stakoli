import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/data-models/department';
import { DataService, ModalModes } from 'src/app/services/data.service';

@Component({
  selector: 'app-read-old-excel-modal',
  templateUrl: './read-old-excel-modal.component.html',
  styleUrls: ['./read-old-excel-modal.component.css']
})
export class ReadOldExcelModalComponent implements OnInit {

  dataService: DataService;
  sheetCheck: boolean[] = [];

  yearMissmatch: boolean = false;
  selectedYear: number = NaN;

  isNan = isNaN;



  constructor(data: DataService) {
    this.dataService = data;
  }

  ngOnInit(): void {
    for (let dataSet of this.dataService.foundSheetsList) {
      if (dataSet.error || isNaN(dataSet.obj.year)) {
        continue;
      }

      if (isNaN(this.selectedYear)) {
        this.selectedYear = dataSet.obj.year;
      }
      else {
        if (this.selectedYear !== dataSet.obj.year) {
          this.yearMissmatch = true;
          break;
        }
      }
    }

    if (isNaN(this.selectedYear)) {
      this.selectedYear = new Date().getFullYear();
    }

    if (this.yearMissmatch) {
      this.sheetCheck = new Array<boolean>(this.dataService.foundSheetsList.length);
    }
    else {
      for (let dataSet of this.dataService.foundSheetsList) {
        this.sheetCheck.push(dataSet.error === undefined);
      }
    }
  }

  applyData(): void {
    let output: {name: string, department: Department}[] = [];

    for (let i = 0; i < this.sheetCheck.length; ++i) {
      if (this.sheetCheck[i]) {
        output.push({name: this.dataService.foundSheetsList[i].name, department: this.dataService.foundSheetsList[i].obj.department});
        this.dataService.attendanceTypes = this.dataService.mergeArrays(this.dataService.attendanceTypes, this.dataService.foundSheetsList[i].obj.attendanceTypes);
      }
    }

    let temp = [];
    for (let i of output) {
      temp.push(JSON.stringify(i));
    }
    console.log(temp);

    this.dataService.data = output;
    this.dataService.year = this.getPositivInteger(this.selectedYear);
    this.dataService.OnNewDataApplied.emit();
    this.dataService.modalMode.next(ModalModes.NONE);
  }

  onYearChanged(event: Event) {
    let element = event.target as HTMLInputElement;
    element.valueAsNumber = this.getPositivInteger(element.valueAsNumber);
  }

  getPositivInteger(value: number): number {
    if (this.isNan(value)) {
      return 0;
    }
    return Number.parseInt(value.toString().replace(/[^0-9]/g, ""));
  }

}
