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
  currentYear: number;
  sheetCheck: boolean[] = [];

  constructor(data: DataService) {
    this.dataService = data;
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    for (let dataSet of this.dataService.foundSheetsList) {
      this.sheetCheck.push(dataSet.error === undefined);
    }
  }

  applyData(): void {
    let output: {name: string, department: Department}[] = [];

    for (let i = 0; i < this.sheetCheck.length; ++i) {
      if (this.sheetCheck[i]) {
        output.push({name: this.dataService.foundSheetsList[i].name, department: this.dataService.foundSheetsList[i].obj.department})
      }
    }

    let temp = [];
    for (let i of output) {
      temp.push(JSON.stringify(i));
    }
    console.log(temp);

    this.dataService.data = output;
    this.dataService.modalMode.next(ModalModes.NONE);
  }

}
